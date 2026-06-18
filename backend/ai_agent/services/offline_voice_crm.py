from __future__ import annotations

import re
import tempfile
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

from sales.models import AddAccountData, FormSettingsStore
from sales.serializers import AddAccountDataSerializer

from ..models import AgentSessionMemory
from ..nlp.company_extractor import CompanyExtractor
from ..training.learning_pipeline import LearningPipeline
from ..utils import get_ai_agent_logger, get_ai_agent_settings, normalize_agent_text
from .agent_brain import OfflineVoiceAgentBrain


class OfflineVoiceCRMService:
    def __init__(self):
        self.logger = get_ai_agent_logger(__name__)
        self.settings = get_ai_agent_settings()
        self.brain = OfflineVoiceAgentBrain()
        self.company_extractor = CompanyExtractor()
        self.learning_pipeline = LearningPipeline()

    def preview_from_audio(self, user, uploaded_file, session_id: str | None = None) -> dict[str, Any]:
        session = self._get_or_create_session(user, session_id)
        wav_path = self._persist_temp_wav(uploaded_file)

        try:
            result = self.brain.process_audio_with_metadata(wav_path)
        finally:
            wav_path.unlink(missing_ok=True)

        transcript = result["transcript"]
        ai_payload = result["ai_output"]
        ai_payload["extracted_data"] = self._resolve_company_name_with_crm(
            user,
            transcript,
            ai_payload.get("extracted_data", {}),
        )
        preview_data = self._map_to_account_payload(ai_payload["extracted_data"])
        if ai_payload["intent"] == "update_account":
            preview_data = self._prepare_update_preview(user, preview_data)
        missing_fields = self._get_missing_fields(preview_data)
        if ai_payload["intent"] == "search_account":
            search_results = self._search_accounts(user, ai_payload["extracted_data"].get("account_name", ""))
            session.intent = ai_payload["intent"]
            session.last_user_input = transcript
            session.collected_data = {
                "transcript": transcript,
                "ai_output": ai_payload,
                "search_results": search_results,
            }
            session.missing_fields = []
            session.current_state = "VOICE_SEARCH_RESULTS"
            session.save()
            return {
                "session_id": session.session_id,
                "status": "search_results",
                "intent": ai_payload["intent"],
                "confidence": ai_payload["confidence"],
                "transcript": transcript,
                "data": {"results": search_results},
                "missing_fields": [],
                "raw_ai_output": ai_payload,
            }

        session.intent = ai_payload["intent"]
        session.last_user_input = transcript
        session.collected_data = {
            "transcript": transcript,
            "ai_output": ai_payload,
            "preview_data": preview_data,
        }
        session.missing_fields = missing_fields
        session.current_state = "VOICE_PREVIEW"
        session.save()

        return {
            "session_id": session.session_id,
            "status": "preview",
            "intent": ai_payload["intent"],
            "confidence": ai_payload["confidence"],
            "transcript": transcript,
            "data": preview_data,
            "missing_fields": missing_fields,
            "raw_ai_output": ai_payload,
        }

    def confirm_preview(
        self,
        user,
        session_id: str,
        corrected_data: dict[str, Any] | None = None,
        save_to_db: bool = False,
    ) -> dict[str, Any]:
        session = AgentSessionMemory.objects.filter(session_id=session_id, user=user).first()
        if not session:
            raise ValueError("Session not found.")

        stored = session.collected_data or {}
        ai_output = stored.get("ai_output", {})
        transcript = stored.get("transcript", session.last_user_input or "")
        preview_data = dict(stored.get("preview_data", {}))
        preview_data.update({key: value for key, value in (corrected_data or {}).items() if value not in (None, "")})
        missing_fields = self._get_missing_fields(preview_data)

        session.collected_data = {
            "transcript": transcript,
            "ai_output": ai_output,
            "preview_data": preview_data,
        }
        session.missing_fields = missing_fields
        session.current_state = "VOICE_CONFIRMED" if save_to_db else "VOICE_PREVIEW"
        session.save(update_fields=["collected_data", "missing_fields", "current_state", "updated_at"])

        if not save_to_db:
            return {
                "session_id": session.session_id,
                "status": "preview",
                "intent": session.intent,
                "confidence": ai_output.get("confidence", 0.0),
                "data": preview_data,
                "missing_fields": missing_fields,
            }

        serializer_payload = self._serializer_payload(preview_data)
        if session.intent == "update_account" and preview_data.get("existing_account_id"):
            account = AddAccountData.objects.filter(
                user=user,
                id=preview_data["existing_account_id"],
            ).first()
            if not account:
                raise ValueError("The selected account for update no longer exists.")
            serializer = AddAccountDataSerializer(account, data=serializer_payload, partial=True)
            status_name = "updated"
        else:
            serializer = AddAccountDataSerializer(data=serializer_payload)
            status_name = "created"
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        source_text = self._reconstruct_learning_text(ai_output)
        self.learning_pipeline.log_correction(
            original_text=transcript or source_text,
            corrected_output=preview_data,
            confirmed_intent=session.intent or ai_output.get("intent"),
        )

        session.current_state = "VOICE_SAVED"
        session.collected_data = {}
        session.missing_fields = []
        session.intent = ""
        session.save(update_fields=["current_state", "collected_data", "missing_fields", "intent", "updated_at"])

        return {
            "session_id": session.session_id,
            "status": status_name,
            "intent": ai_output.get("intent", "create_account"),
            "confidence": ai_output.get("confidence", 0.0),
            "data": serializer.data,
            "missing_fields": [],
        }

    def _get_or_create_session(self, user, session_id: str | None) -> AgentSessionMemory:
        if session_id:
            existing = AgentSessionMemory.objects.filter(session_id=session_id, user=user).first()
            if existing:
                return existing
        return AgentSessionMemory.objects.create(user=user, current_state="VOICE_START")

    def _persist_temp_wav(self, uploaded_file) -> Path:
        suffix = Path(uploaded_file.name or "voice.wav").suffix or ".wav"
        temp_dir = self.settings.temp_audio_dir
        temp_dir.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=temp_dir) as handle:
            for chunk in uploaded_file.chunks():
                handle.write(chunk)
            return Path(handle.name)

    def _map_to_account_payload(self, extracted_data: dict[str, Any]) -> dict[str, Any]:
        return {
            "account_name": extracted_data.get("account_name", ""),
            "mobile_number": extracted_data.get("mobile_number", ""),
            "email_id": extracted_data.get("email_id", ""),
            "address": extracted_data.get("address", ""),
            "location": extracted_data.get("address", ""),
            "website": extracted_data.get("website", ""),
            "contacts": [],
            "finance": [],
            "company": [],
        }

    def _serializer_payload(self, preview_data: dict[str, Any]) -> dict[str, Any]:
        payload = {
            "account_name": preview_data.get("account_name", ""),
            "mobile_number": preview_data.get("mobile_number", ""),
            "email_id": preview_data.get("email_id", ""),
            "address": preview_data.get("address", ""),
            "location": preview_data.get("location", ""),
            "contacts": preview_data.get("contacts", []),
            "finance": preview_data.get("finance", []),
            "company": preview_data.get("company", []),
        }
        return payload

    def _prepare_update_preview(self, user, preview_data: dict[str, Any]) -> dict[str, Any]:
        account_name = (preview_data.get("account_name") or "").strip()
        if not account_name:
            return preview_data
        matches = AddAccountData.objects.filter(user=user, account_name__icontains=account_name).order_by("id")
        if matches.count() != 1:
            return preview_data
        account = matches.first()
        merged = {
            "existing_account_id": account.id,
            "account_name": preview_data.get("account_name") or account.account_name or "",
            "mobile_number": preview_data.get("mobile_number") or account.mobile_number or "",
            "email_id": preview_data.get("email_id") or account.email_id or "",
            "address": preview_data.get("address") or account.address or "",
            "location": preview_data.get("location") or account.location or "",
            "contacts": preview_data.get("contacts", []),
            "finance": preview_data.get("finance", []),
            "company": preview_data.get("company", []),
        }
        return merged

    def _search_accounts(self, user, account_name: str) -> list[dict[str, Any]]:
        query = AddAccountData.objects.filter(user=user)
        for token in [item for item in account_name.split() if item]:
            query = query.filter(account_name__icontains=token)
        return list(
            query.order_by("account_name").values(
                "id",
                "account_name",
                "mobile_number",
                "email_id",
                "location",
                "city",
                "state",
            )[:10]
        )

    def _get_missing_fields(self, payload: dict[str, Any]) -> list[str]:
        field_names = ["account_name"]
        settings_store = FormSettingsStore.objects.order_by("id").first()
        if settings_store and isinstance(settings_store.account, dict):
            configured = settings_store.account.get("requiredFields", [])
            field_names = [field for field in configured if field in AddAccountDataSerializer.Meta.fields]
        return [field for field in field_names if payload.get(field) in (None, "", [], {})]

    def _reconstruct_learning_text(self, ai_output: dict[str, Any]) -> str:
        extracted = ai_output.get("extracted_data", {})
        fragments = [
            extracted.get("account_name", ""),
            extracted.get("mobile_number", ""),
            extracted.get("email_id", ""),
            extracted.get("address", ""),
            extracted.get("website", ""),
        ]
        return " ".join(item for item in fragments if item).strip()

    def _resolve_company_name_with_crm(
        self,
        user,
        transcript: str,
        extracted_data: dict[str, Any],
    ) -> dict[str, Any]:
        resolved = dict(extracted_data or {})
        candidate_name = (resolved.get("account_name") or "").strip()
        reference_names = list(
            AddAccountData.objects.filter(user=user)
            .exclude(account_name__isnull=True)
            .exclude(account_name__exact="")
            .values_list("account_name", flat=True)
        )
        if not reference_names:
            return resolved

        candidate_pool = [candidate_name] if candidate_name else []
        candidate_pool.extend(
            candidate.name
            for candidate in self.company_extractor.extract_candidates(transcript)[:5]
            if candidate.name
        )
        email_id = (resolved.get("email_id") or "").strip()
        website = (resolved.get("website") or "").strip()
        domain_hint = self._extract_company_domain_hint(email_id or website)

        best_name = ""
        best_score = 0.0
        second_score = 0.0
        for reference_name in reference_names:
            score = self._score_reference_name(reference_name, candidate_pool, domain_hint)
            if score > best_score:
                second_score = best_score
                best_score = score
                best_name = reference_name
            elif score > second_score:
                second_score = score

        resolution_threshold = 0.85 if domain_hint else 0.91
        if best_name and best_score >= resolution_threshold and (best_score - second_score >= 0.03 or best_score >= 0.97):
            self.logger.info(
                "Resolved company name '%s' to CRM account '%s' with score %.3f",
                candidate_name or transcript,
                best_name,
                best_score,
            )
            resolved["account_name"] = best_name
        return resolved

    def _score_reference_name(
        self,
        reference_name: str,
        candidate_pool: list[str],
        domain_hint: str,
    ) -> float:
        reference_normalized = self._normalize_name(reference_name)
        reference_full = self._normalize_name(reference_name, strip_suffixes=False)
        if not reference_normalized:
            return 0.0

        best = 0.0
        for candidate in [item for item in candidate_pool if item]:
            candidate_normalized = self._normalize_name(candidate)
            candidate_full = self._normalize_name(candidate, strip_suffixes=False)
            if not candidate_normalized:
                continue
            score = SequenceMatcher(None, candidate_normalized, reference_normalized).ratio()
            score = max(score, SequenceMatcher(None, candidate_full, reference_full).ratio())
            if candidate_normalized in reference_normalized or reference_normalized in candidate_normalized:
                score += 0.06
            elif candidate_full in reference_full or reference_full in candidate_full:
                score += 0.04
            if score > best:
                best = score

        if domain_hint:
            reference_compact = reference_normalized.replace(" ", "")
            if domain_hint == reference_compact:
                best += 0.18
            elif domain_hint in reference_compact or reference_compact in domain_hint:
                best += 0.14

        return min(best, 1.0)

    def _extract_company_domain_hint(self, value: str) -> str:
        if not value:
            return ""
        match = re.search(r"(?:@|https?://|www\.)?([A-Za-z0-9-]+)\.", value)
        if not match:
            return ""
        return self._normalize_name(match.group(1)).replace(" ", "")

    def _normalize_name(self, value: str, strip_suffixes: bool = True) -> str:
        normalized = normalize_agent_text(value).lower()
        normalized = re.sub(r"[^a-z0-9]+", " ", normalized)
        if strip_suffixes:
            normalized = re.sub(
                r"\b(?:pvt|private|ltd|limited|llp|inc|corp|corporation|company|co|technologies|technology|solutions|systems|enterprises)\b",
                " ",
                normalized,
            )
        return re.sub(r"\s+", " ", normalized).strip()
