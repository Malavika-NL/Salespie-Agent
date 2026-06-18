import re
import uuid
from difflib import SequenceMatcher
from typing import Any

from sales.models import AddAccountData, FormSettingsStore
from sales.serializers import AddAccountDataSerializer

from ..models import AgentCorrectionLog, AgentSessionMemory, AgentTrainingExample

try:
    from rapidfuzz import fuzz
except Exception:  # pragma: no cover
    fuzz = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except Exception:  # pragma: no cover
    TfidfVectorizer = None
    cosine_similarity = None


class OfflineAccountAgentService:
    COMPANY_CUE_PHRASES = (
        "data name as",
        "details name as",
        "company name as",
        "account name as",
        "company called",
        "company named",
        "account called",
        "account named",
        "client called",
        "client named",
        "name as",
        "company name is",
        "company name",
        "account name is",
        "account name",
        "name of the company is",
        "name of the company",
        "name of company is",
        "name of company",
        "company is",
        "account is",
        "client is",
        "for company",
        "for account",
        "for client",
        "company",
        "account",
        "client",
    )

    COMPANY_TRAILING_CHATTER = (
        "can you",
        "please",
        "add",
        "create",
        "save",
        "store",
        "update",
        "need to",
        "i need to",
        "details",
        "data",
    )

    COMPANY_BAD_TOKENS = {
        "can",
        "you",
        "please",
        "add",
        "create",
        "save",
        "store",
        "update",
        "account",
        "data",
        "details",
        "with",
        "the",
        "and",
        "number",
        "phone",
        "mobile",
        "email",
        "address",
        "is",
        "are",
        "need",
        "to",
    }

    ACCOUNT_STOP_WORDS = (
        "phone number",
        "mobile number",
        "contact number",
        "phone",
        "mobile",
        "email address",
        "email id",
        "email",
        "address",
        "location",
        "city",
        "state",
        "region",
        "vertical",
        "department",
        "designation",
        "business",
        "pic",
        "contact person",
        "person in charge",
        "website",
        "gst",
        "tax",
    )

    ACCOUNT_LEADING_FILLERS = (
        "data name as",
        "details name as",
        "company name as",
        "account name as",
        "for company",
        "for account",
        "for client",
        "for",
        "name as",
        "name",
        "company",
        "company name",
        "account",
        "account name",
        "client",
        "details of",
        "details for",
        "data of",
        "data for",
        "called",
        "named",
        "is",
        "a",
        "an",
        "the",
    )

    STATE_START = "START"
    STATE_UNDERSTAND_INTENT = "UNDERSTAND_INTENT"
    STATE_EXTRACT_INFORMATION = "EXTRACT_INFORMATION"
    STATE_CHECK_REQUIRED_FIELDS = "CHECK_REQUIRED_FIELDS"
    STATE_ASK_MISSING_INFORMATION = "ASK_MISSING_INFORMATION"
    STATE_MERGE_INFORMATION = "MERGE_INFORMATION"
    STATE_PREVIEW_DATA = "PREVIEW_DATA"
    STATE_WAIT_FOR_CONFIRMATION = "WAIT_FOR_CONFIRMATION"
    STATE_SAVE_ACCOUNT = "SAVE_ACCOUNT"
    STATE_LEARN_CORRECTION = "LEARN_CORRECTION"
    STATE_END = "END"

    INTENT_CREATE = "create_account"
    INTENT_UPDATE = "update_account"
    INTENT_SEARCH = "search_account"
    INTENT_UNKNOWN = "unknown"

    def get_or_create_session(self, user, session_id: str | None) -> AgentSessionMemory:
        if session_id:
            session = AgentSessionMemory.objects.filter(session_id=session_id, user=user).first()
            if session:
                return session

        return AgentSessionMemory.objects.create(
            session_id=session_id or str(uuid.uuid4()),
            user=user,
            current_state=self.STATE_START,
        )

    def handle_message(self, user, session_id: str | None, text: str) -> dict[str, Any]:
        session = self.get_or_create_session(user, session_id)
        clean_text = (text or "").strip()
        if not clean_text:
            return self._response(session, "unknown", "Please share the account details or tell me what you want to do.")

        session.last_user_input = clean_text
        session.current_state = self.STATE_UNDERSTAND_INTENT

        intent = self.detect_intent(clean_text, session.intent)
        session.intent = intent

        if intent == self.INTENT_SEARCH:
            results = self.search_accounts(user, clean_text)
            session.current_state = self.STATE_END
            session.collected_data = {"search_results": results}
            session.missing_fields = []
            session.save(update_fields=["last_user_input", "intent", "current_state", "collected_data", "missing_fields", "updated_at"])
            return {
                "session_id": session.session_id,
                "status": "search_results",
                "reply": self.build_search_reply(results),
                "intent": intent,
                "data": {"results": results},
                "missing_fields": [],
            }

        session.current_state = self.STATE_EXTRACT_INFORMATION
        extracted = self.extract_data(user, clean_text, intent)
        merged = self.merge_data(session.collected_data, extracted)
        if intent == self.INTENT_UPDATE:
            merged = self.attach_existing_account(user, merged)

        session.current_state = self.STATE_CHECK_REQUIRED_FIELDS
        missing_fields = self.get_missing_fields(merged)

        session.collected_data = merged
        session.missing_fields = missing_fields
        session.current_state = self.STATE_ASK_MISSING_INFORMATION if missing_fields else self.STATE_WAIT_FOR_CONFIRMATION
        session.save()

        if missing_fields:
            return {
                "session_id": session.session_id,
                "status": "missing_fields",
                "reply": self.build_missing_reply(missing_fields, merged),
                "intent": intent,
                "data": merged,
                "missing_fields": missing_fields,
            }

        return {
            "session_id": session.session_id,
            "status": "preview",
            "reply": self.build_preview_reply(intent),
            "intent": intent,
            "data": merged,
            "missing_fields": [],
        }

    def apply_correction(self, user, session_id: str, corrected_data: dict[str, Any]) -> dict[str, Any]:
        session = AgentSessionMemory.objects.filter(session_id=session_id, user=user).first()
        if not session:
            raise ValueError("Session not found.")

        original_output = session.collected_data or {}
        merged = self.merge_data(original_output, corrected_data or {})
        missing_fields = self.get_missing_fields(merged)

        AgentCorrectionLog.objects.create(
            session_id=session.session_id,
            user=user,
            original_output=original_output,
            corrected_output=merged,
            user_input=session.last_user_input,
        )
        AgentTrainingExample.objects.create(
            user=user,
            user_input=session.last_user_input or "",
            intent=session.intent or self.INTENT_UNKNOWN,
            corrected_output=merged,
            model_fields=self.get_model_field_names(),
        )

        session.collected_data = merged
        session.missing_fields = missing_fields
        session.current_state = self.STATE_ASK_MISSING_INFORMATION if missing_fields else self.STATE_WAIT_FOR_CONFIRMATION
        session.save(update_fields=["collected_data", "missing_fields", "current_state", "updated_at"])

        return {
            "session_id": session.session_id,
            "status": "missing_fields" if missing_fields else "preview",
            "reply": self.build_missing_reply(missing_fields, merged) if missing_fields else "I updated the preview. Review it and confirm when you're ready.",
            "intent": session.intent,
            "data": merged,
            "missing_fields": missing_fields,
        }

    def confirm(self, user, session_id: str, allow_partial_save: bool = False) -> dict[str, Any]:
        session = AgentSessionMemory.objects.filter(session_id=session_id, user=user).first()
        if not session:
            raise ValueError("Session not found.")

        payload = self.prepare_serializer_payload(session.collected_data)
        missing_fields = self.get_missing_fields(payload)
        if missing_fields and not allow_partial_save:
            session.missing_fields = missing_fields
            session.current_state = self.STATE_ASK_MISSING_INFORMATION
            session.save(update_fields=["missing_fields", "current_state", "updated_at"])
            return {
                "session_id": session.session_id,
                "status": "missing_fields",
                "reply": self.build_missing_reply(missing_fields, payload),
                "intent": session.intent,
                "data": payload,
                "missing_fields": missing_fields,
            }

        session.current_state = self.STATE_SAVE_ACCOUNT

        if session.intent == self.INTENT_UPDATE:
            account = self.resolve_account_for_update(user, payload)
            if not account:
                return {
                    "session_id": session.session_id,
                    "status": "unknown",
                    "reply": "I could not find a single matching account to update. Please correct the account name first.",
                    "intent": session.intent,
                    "data": payload,
                    "missing_fields": [],
                }
            serializer = AddAccountDataSerializer(account, data=payload, partial=True)
            action = "updated"
        else:
            serializer = AddAccountDataSerializer(data=payload)
            action = "created"

        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        self.learn_from_final_payload(user, session.last_user_input, session.intent, payload)

        session.current_state = self.STATE_END
        session.missing_fields = []
        session.collected_data = {}
        session.intent = ""
        session.save(update_fields=["current_state", "missing_fields", "collected_data", "intent", "updated_at"])

        reply = f"Account {action} successfully."
        if missing_fields and allow_partial_save:
            labels = ", ".join(field.replace("_", " ") for field in missing_fields)
            reply = f"Account {action} successfully with partial information. Missing fields skipped: {labels}."

        return {
            "session_id": session.session_id,
            "status": action,
            "reply": reply,
            "intent": self.INTENT_CREATE if action == "created" else self.INTENT_UPDATE,
            "data": serializer.data,
            "missing_fields": [],
        }

    def detect_intent(self, text: str, current_intent: str | None) -> str:
        normalized = self.normalize(text)
        if any(word in normalized for word in ["search", "find", "show", "lookup", "look up"]):
            return self.INTENT_SEARCH
        if any(word in normalized for word in ["update", "edit", "change", "modify"]):
            return self.INTENT_UPDATE
        if any(word in normalized for word in ["create", "add", "new", "register"]):
            return self.INTENT_CREATE
        return current_intent or self.INTENT_CREATE

    def extract_data(self, user, text: str, intent: str) -> dict[str, Any]:
        extracted: dict[str, Any] = {}
        fields = self.get_field_descriptors()
        normalized_aliases = self.build_field_aliases(fields)

        emails = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text)
        phone = self.extract_phone_number(text)
        address = self.extract_address(text)
        websites = re.findall(r"\b(?:https?://)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/\S*)?\b", text)

        if emails:
            extracted["email_id"] = emails[0]
        if phone:
            extracted["mobile_number"] = phone
        if address:
            extracted["address"] = address
        if websites:
            extracted["website"] = websites[0]

        account_name = self.extract_account_name_from_training(user, text, intent)
        if not account_name:
            account_name = self.extract_account_name(text)
        if account_name:
            extracted["account_name"] = account_name

        clauses = [part.strip() for part in re.split(r"[\n,;]+", text) if part.strip()]
        learned_example = self.find_best_training_example(user, text, intent)

        for clause in clauses:
            lower_clause = self.normalize(clause)
            matched_field = None
            matched_score = -1.0
            for field_name, aliases in normalized_aliases.items():
                for alias in aliases:
                    score = self.score_similarity(lower_clause, alias)
                    if alias and alias in lower_clause:
                        score += 0.2
                    if score > matched_score:
                        matched_score = score
                        matched_field = field_name

            if matched_field and matched_score >= 0.72:
                if matched_field == "account_name":
                    clause_account_name = self.extract_account_name_from_clause(clause)
                    if clause_account_name and "account_name" not in extracted:
                        extracted["account_name"] = clause_account_name
                    continue
                value = self.extract_value_from_clause(clause, normalized_aliases[matched_field])
                if value:
                    extracted[matched_field] = self.cast_value(matched_field, value, fields)

        if learned_example:
            extracted = self.apply_training_hint(text, extracted, learned_example)

        allowed_fields = set(self.get_model_field_names()) | {"contacts", "finance", "company", "existing_account_id", "website"}
        return {key: value for key, value in extracted.items() if key in allowed_fields and value not in (None, "", [], {})}

    def find_best_training_example(self, user, text: str, intent: str) -> AgentTrainingExample | None:
        examples = self.get_training_examples(user, intent)
        if not examples:
            return None

        if TfidfVectorizer and cosine_similarity and len(examples) > 1:
            corpus = [text] + [item.user_input for item in examples]
            matrix = TfidfVectorizer().fit_transform(corpus)
            scores = cosine_similarity(matrix[0:1], matrix[1:]).flatten()
            best_index = int(scores.argmax())
            if float(scores[best_index]) >= 0.35:
                return examples[best_index]

        best = None
        best_score = 0.0
        for example in examples:
            score = self.score_similarity(text, example.user_input)
            if score > best_score:
                best_score = score
                best = example
        return best if best_score >= 0.65 else None

    def get_training_examples(self, user, intent: str) -> list[AgentTrainingExample]:
        examples = list(
            AgentTrainingExample.objects.filter(user=user, intent=intent)
            .exclude(corrected_output={})
            .order_by("-created_at")[:75]
        )
        if examples:
            return examples
        return list(
            AgentTrainingExample.objects.filter(intent=intent)
            .exclude(corrected_output={})
            .order_by("-created_at")[:75]
        )

    def apply_training_hint(self, text: str, extracted: dict[str, Any], example: AgentTrainingExample) -> dict[str, Any]:
        for field_name, value in (example.corrected_output or {}).items():
            if field_name in extracted:
                continue
            if isinstance(value, str) and value and self.normalize(value) in self.normalize(text):
                extracted[field_name] = value
        return extracted

    def attach_existing_account(self, user, data: dict[str, Any]) -> dict[str, Any]:
        if data.get("existing_account_id"):
            return data
        account_name = data.get("account_name")
        if not account_name:
            return data
        matches = AddAccountData.objects.filter(user=user, account_name__icontains=account_name).order_by("id")
        if matches.count() == 1:
            data["existing_account_id"] = matches.first().id
        return data

    def search_accounts(self, user, text: str) -> list[dict[str, Any]]:
        account_name = self.extract_account_name(text) or text
        query = AddAccountData.objects.filter(user=user)
        for token in [token for token in re.split(r"\s+", account_name) if token]:
            query = query.filter(account_name__icontains=token)
        accounts = query.order_by("account_name")[:10]
        return [
            {
                "id": account.id,
                "account_name": account.account_name,
                "department": account.department,
                "vertical": account.vertical,
                "pic": account.pic,
                "mobile_number": account.mobile_number,
                "email_id": account.email_id,
                "city": account.city,
                "state": account.state,
            }
            for account in accounts
        ]

    def prepare_serializer_payload(self, data: dict[str, Any]) -> dict[str, Any]:
        field_names = set(self.get_model_field_names())
        payload = {key: value for key, value in (data or {}).items() if key in field_names}
        payload.setdefault("contacts", [])
        payload.setdefault("finance", [])
        payload.setdefault("company", [])
        return payload

    def resolve_account_for_update(self, user, data: dict[str, Any]) -> AddAccountData | None:
        account_id = data.get("existing_account_id")
        if account_id:
            return AddAccountData.objects.filter(user=user, id=account_id).first()
        account_name = data.get("account_name")
        if not account_name:
            return None
        matches = AddAccountData.objects.filter(user=user, account_name__iexact=account_name)
        if matches.count() == 1:
            return matches.first()
        return None

    def merge_data(self, existing: dict[str, Any] | None, incoming: dict[str, Any] | None) -> dict[str, Any]:
        merged = dict(existing or {})
        for key, value in (incoming or {}).items():
            if value in (None, "", [], {}):
                continue
            merged[key] = value
        return merged

    def get_missing_fields(self, data: dict[str, Any]) -> list[str]:
        required_fields = self.get_required_field_names()
        missing = []
        for field_name in required_fields:
            value = data.get(field_name)
            if value in (None, "", [], {}):
                missing.append(field_name)
        return missing

    def get_field_descriptors(self) -> list[dict[str, Any]]:
        descriptors = []
        for field in AddAccountData._meta.get_fields():
            if not getattr(field, "editable", False):
                continue
            if getattr(field, "auto_created", False):
                continue
            if field.name in {"id", "user"}:
                continue
            descriptors.append(
                {
                    "name": field.name,
                    "verbose_name": str(getattr(field, "verbose_name", field.name)),
                    "required": not getattr(field, "blank", True) and not getattr(field, "null", True),
                    "type": field.get_internal_type(),
                    "max_length": getattr(field, "max_length", None),
                }
            )
        return descriptors

    def get_model_field_names(self) -> list[str]:
        return [item["name"] for item in self.get_field_descriptors()]

    def get_required_field_names(self) -> list[str]:
        settings_store = FormSettingsStore.objects.order_by("id").first()
        configured = []
        if settings_store and isinstance(settings_store.account, dict):
            configured = [
                item
                for item in settings_store.account.get("requiredFields", [])
                if item in self.get_model_field_names()
            ]
        if configured:
            return configured
        return [item["name"] for item in self.get_field_descriptors() if item["required"]]

    def build_field_aliases(self, fields: list[dict[str, Any]]) -> dict[str, list[str]]:
        aliases: dict[str, list[str]] = {}
        for field in fields:
            base = field["name"]
            verbose = field["verbose_name"]
            variants = {
                self.normalize(base),
                self.normalize(verbose),
                self.normalize(base.replace("_", " ")),
            }
            if base.endswith("_id"):
                variants.add(self.normalize(base[:-3]))
            aliases[base] = [item for item in variants if item]
        aliases.setdefault("email_id", []).extend(["email", "mail id", "email address"])
        aliases.setdefault("mobile_number", []).extend(["phone", "phone number", "mobile", "mobile number", "contact number"])
        aliases.setdefault("account_name", []).extend(["account", "account name", "company", "company name", "client"])
        aliases.setdefault("pic", []).extend(["pic", "person in charge", "contact person"])
        return aliases

    def extract_account_name(self, text: str) -> str | None:
        candidates: list[str] = []

        candidates.extend(self.extract_company_candidates(text))

        patterns = [
            r"(?:data name as|details name as|company name as|account name as|name as)\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone number|mobile number|contact number|phone|mobile|email|address|location|city|state|region|vertical|department|designation|business|pic)\b|$))",
            r"(?:create|add|update|edit)\s+(?:an?\s+)?account(?:\s+data)?(?:\s+for|\s+with|\s+of)?\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone number|mobile number|contact number|phone|mobile|email|address|location|city|state|region|vertical|department|designation|business|pic)\b|$))",
            r"(?:company|account|client)\s+(?:is|called|named)\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone number|mobile number|contact number|phone|mobile|email|address|location|city|state|region|vertical|department|designation|business|pic|website|gst|tax)\b|$))",
            r"(?:create|add|save|store|register)\s+(?:an?\s+)?(?:company|client)(?:\s+account)?(?:\s+for)?\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone number|mobile number|contact number|phone|mobile|email|address|location|city|state|region|vertical|department|designation|business|pic|website|gst|tax)\b|$))",
            r"(?:for|of)\s+(?:company|account|client)\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone number|mobile number|contact number|phone|mobile|email|address|location|city|state|region|vertical|department|designation|business|pic|website|gst|tax)\b|$))",
            r"['\"]([A-Za-z0-9&().,\- ]{2,})['\"]",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                candidates.append(match.group(1))

        cleaned_candidates = []
        for candidate in candidates:
            cleaned = self.clean_account_name(candidate)
            if cleaned:
                cleaned_candidates.append(cleaned)

        if not cleaned_candidates:
            return None

        scored = sorted(
            ((self.score_company_candidate(candidate), candidate) for candidate in cleaned_candidates),
            key=lambda item: (item[0], len(item[1])),
            reverse=True,
        )
        best_score, best_candidate = scored[0]
        return best_candidate if best_score > 0 else None

    def extract_account_name_from_training(self, user, text: str, intent: str) -> str | None:
        examples = self.get_training_examples(user, intent)
        if not examples:
            return None

        best_candidate = None
        best_score = 0
        for example in examples:
            company_name = self.clean_account_name((example.corrected_output or {}).get("account_name", ""))
            if not company_name:
                continue
            candidate, score = self.extract_account_name_using_example(text, example.user_input, company_name)
            if candidate and score > best_score:
                best_candidate = candidate
                best_score = score

        return best_candidate if best_score >= 4 else None

    def extract_account_name_using_example(self, current_text: str, example_text: str, company_name: str) -> tuple[str | None, int]:
        example_tokens = self.tokenize_text(example_text)
        current_tokens = self.tokenize_text(current_text)
        company_tokens = [item["normalized"] for item in self.tokenize_text(company_name)]
        if not example_tokens or not current_tokens or not company_tokens:
            return None, 0

        example_norm = [item["normalized"] for item in example_tokens]
        company_start = self.find_subsequence(example_norm, company_tokens)
        if company_start < 0:
            return None, 0

        company_end = company_start + len(company_tokens)
        prefix = [token for token in example_norm[max(0, company_start - 4):company_start] if token]
        suffix = [token for token in example_norm[company_end:company_end + 4] if token]

        current_norm = [item["normalized"] for item in current_tokens]
        prefix_index = self.find_subsequence(current_norm, prefix) if prefix else -1
        if prefix and prefix_index < 0:
            return None, 0

        start_index = prefix_index + len(prefix) if prefix else 0
        stop_index = self.find_stop_index_for_company(current_norm, start_index, suffix)
        raw_candidate = " ".join(item["original"] for item in current_tokens[start_index:stop_index]).strip()
        cleaned_candidate = self.clean_account_name(raw_candidate)
        if not cleaned_candidate:
            return None, 0

        score = len(prefix) + (2 if suffix else 0) + self.score_company_candidate(cleaned_candidate)
        if not self.looks_like_company_name(cleaned_candidate):
            return None, 0
        return cleaned_candidate, score

    def tokenize_text(self, text: str) -> list[dict[str, str]]:
        tokens = []
        for match in re.finditer(r"[A-Za-z0-9&().'-]+", str(text or "")):
            original = match.group(0)
            normalized = self.normalize(original)
            if normalized:
                tokens.append({"original": original, "normalized": normalized})
        return tokens

    def find_subsequence(self, haystack: list[str], needle: list[str]) -> int:
        if not needle or len(needle) > len(haystack):
            return -1
        for index in range(len(haystack) - len(needle) + 1):
            if haystack[index:index + len(needle)] == needle:
                return index
        return -1

    def find_stop_index_for_company(self, tokens: list[str], start_index: int, suffix: list[str]) -> int:
        if suffix:
            suffix_index = self.find_subsequence(tokens[start_index:], suffix)
            if suffix_index >= 0:
                return start_index + suffix_index

        stop_tokens = {self.normalize(item) for item in self.ACCOUNT_STOP_WORDS}
        chatter_tokens = {self.normalize(item) for item in self.COMPANY_BAD_TOKENS}
        index = start_index
        while index < len(tokens):
            token = tokens[index]
            if token in stop_tokens or token in chatter_tokens:
                break
            index += 1
        return index

    def extract_company_candidates(self, text: str) -> list[str]:
        candidates: list[str] = []

        for cue in self.COMPANY_CUE_PHRASES:
            pattern = re.compile(rf"\b{re.escape(cue)}\b\s*(.+)", flags=re.IGNORECASE)
            match = pattern.search(text)
            if not match:
                continue
            raw_segment = match.group(1)
            stop_index = self.find_company_stop_index(raw_segment)
            candidates.append(raw_segment[:stop_index] if stop_index >= 0 else raw_segment)

        return candidates

    def find_company_stop_index(self, text: str) -> int:
        lowered = text.lower()
        stop_phrases = list(self.ACCOUNT_STOP_WORDS) + [
            " and phone",
            " and mobile",
            " and email",
            " with phone",
            " with mobile",
            " with email",
            " whose phone",
            " whose mobile",
        ]
        indexes = [lowered.find(stop_phrase) for stop_phrase in stop_phrases if lowered.find(stop_phrase) >= 0]
        return min(indexes) if indexes else -1

    def extract_account_name_from_clause(self, clause: str) -> str | None:
        return self.extract_account_name(clause)

    def clean_account_name(self, value: str) -> str:
        cleaned = re.sub(r"\s+", " ", str(value or "")).strip(" .,-'\"")
        cleaned = re.sub(r"^[^A-Za-z0-9]+", "", cleaned)

        changed = True
        while changed and cleaned:
            changed = False
            for filler in sorted(self.ACCOUNT_LEADING_FILLERS, key=len, reverse=True):
                updated = re.sub(rf"^(?:{re.escape(filler)})\s+", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
                if updated != cleaned:
                    cleaned = updated.strip(" .,-'\"")
                    changed = True
                    break

        stop_pattern = "|".join(re.escape(word) for word in self.ACCOUNT_STOP_WORDS)
        cleaned = re.split(
            rf"\b(?:and\s+)?(?:a\s+|an\s+|the\s+)?(?:{stop_pattern})\b",
            cleaned,
            maxsplit=1,
            flags=re.IGNORECASE,
        )[0].strip(" .,-'\"")

        cleaned = re.sub(
            r"\b(?:and|with|with the|details|data|is|are|please|add|save|store|create|update)\b\s*$",
            "",
            cleaned,
            flags=re.IGNORECASE,
        ).strip(" .,-'\"")
        cleaned = re.sub(r"^(?:data|details)\s+name\s+as\s+", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
        cleaned = re.sub(r"^(?:company|account)\s+name\s+as\s+", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
        cleaned = re.sub(r"^name\s+as\s+", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
        cleaned = re.sub(r"^(?:please\s+)?(?:add|create|save|store|update)\s+", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
        for chatter in self.COMPANY_TRAILING_CHATTER:
            cleaned = re.sub(rf"\b{re.escape(chatter)}\b\s*$", "", cleaned, flags=re.IGNORECASE).strip(" .,-")
        cleaned = re.sub(r"\b(?:and|with|for|of|named|called)\b\s*$", "", cleaned, flags=re.IGNORECASE).strip(" .,-'\"")
        cleaned = re.sub(r"\s+", " ", cleaned).strip(" .,-'\"")
        return cleaned

    def looks_like_company_name(self, value: str) -> bool:
        tokens = re.findall(r"[A-Za-z0-9&().'-]+", value)
        if not tokens:
            return False
        bad_overlap = sum(1 for token in tokens if token.lower() in self.COMPANY_BAD_TOKENS)
        if bad_overlap >= max(1, len(tokens) // 2):
            return False
        alpha_tokens = [token for token in tokens if any(char.isalpha() for char in token)]
        return len(alpha_tokens) >= 1

    def score_company_candidate(self, candidate: str) -> int:
        tokens = re.findall(r"[A-Za-z0-9&().'-]+", candidate)
        if not tokens:
            return -100

        score = 0
        strong_tokens = 0
        for token in tokens:
            lowered = token.lower()
            if lowered in self.COMPANY_BAD_TOKENS:
                score -= 4
                continue
            if any(char.isalpha() for char in token) and len(token) >= 2:
                strong_tokens += 1
                score += 3
            if token[:1].isupper() or token.isupper():
                score += 2

        if strong_tokens == 0:
            return -100
        if len(tokens) > 8:
            score -= (len(tokens) - 8) * 2
        return score

    def learn_from_final_payload(self, user, user_input: str, intent: str, payload: dict[str, Any]) -> None:
        account_name = self.clean_account_name(payload.get("account_name", ""))
        if not user_input or not account_name or not self.looks_like_company_name(account_name):
            return

        AgentTrainingExample.objects.create(
            user=user,
            user_input=user_input,
            intent=intent or self.INTENT_UNKNOWN,
            corrected_output={
                "account_name": account_name,
                "mobile_number": payload.get("mobile_number", ""),
                "address": payload.get("address", ""),
            },
            model_fields=["account_name", "mobile_number", "address"],
        )

    def extract_phone_number(self, text: str) -> str | None:
        candidates = re.findall(r"(?<!\d)(?:\+?\d[\d()\-\s]{7,18}\d)(?!\d)", text)
        best_value = None
        best_score = -1
        for candidate in candidates:
            digits_only = re.sub(r"\D", "", candidate)
            if len(digits_only) < 10:
                continue
            score = len(digits_only)
            if "phone" in self.normalize(text) or "mobile" in self.normalize(text):
                score += 2
            if score > best_score:
                best_score = score
                best_value = candidate
        return re.sub(r"[^\d+]", "", best_value) if best_value else None

    def extract_address(self, text: str) -> str | None:
        patterns = [
            r"(?:address is|address:|address)\s+(.+?)(?=(?:\b(?:phone|mobile|email|company|account|pic|region|state|city)\b|$))",
            r"(?:located at|located in|location is|location at)\s+(.+?)(?=(?:\b(?:phone|mobile|email|company|account|pic|region|state|city)\b|$))",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                value = re.sub(r"\s+", " ", match.group(1)).strip(" .,-")
                if value:
                    return value
        return None

    def extract_value_from_clause(self, clause: str, aliases: list[str]) -> str:
        working = clause
        for alias in aliases:
            if not alias:
                continue
            pattern = re.compile(re.escape(alias), flags=re.IGNORECASE)
            working = pattern.sub("", working)
        working = re.sub(r"^[\s:=-]+", "", working).strip()
        return working

    def cast_value(self, field_name: str, value: Any, fields: list[dict[str, Any]]) -> Any:
        descriptor = next((item for item in fields if item["name"] == field_name), None)
        if not descriptor:
            return value
        if descriptor["type"] in {"IntegerField", "BigIntegerField", "PositiveIntegerField"}:
            digits = re.sub(r"[^\d]", "", str(value))
            return int(digits) if digits else value
        if descriptor["max_length"]:
            return str(value)[: descriptor["max_length"]]
        return value

    def score_similarity(self, left: str, right: str) -> float:
        a = self.normalize(left)
        b = self.normalize(right)
        if not a or not b:
            return 0.0
        if fuzz:
            return float(fuzz.token_set_ratio(a, b)) / 100.0
        return SequenceMatcher(None, a, b).ratio()

    def normalize(self, value: Any) -> str:
        text = str(value or "").lower()
        text = re.sub(r"[_\-]+", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def build_missing_reply(self, missing_fields: list[str], data: dict[str, Any]) -> str:
        if not missing_fields:
            return "I have enough information. Please review the preview and confirm."
        labels = ", ".join(field.replace("_", " ") for field in missing_fields)
        known_name = data.get("account_name")
        if known_name:
            return f"I've started the draft for {known_name}. I still need: {labels}."
        return f"I need a few more details before I can prepare the final preview: {labels}."

    def build_preview_reply(self, intent: str) -> str:
        if intent == self.INTENT_UPDATE:
            return "I prepared the update preview. Please review the fields, make any corrections, and confirm to save."
        return "I prepared the account preview. Please review the fields, make any corrections, and confirm to save."

    def build_search_reply(self, results: list[dict[str, Any]]) -> str:
        if not results:
            return "I couldn't find any matching accounts."
        if len(results) == 1:
            return f"I found 1 matching account: {results[0].get('account_name') or 'Unnamed account'}."
        return f"I found {len(results)} matching accounts."

    def _response(self, session: AgentSessionMemory, status_name: str, reply: str) -> dict[str, Any]:
        session.save()
        return {
            "session_id": session.session_id,
            "status": status_name,
            "reply": reply,
            "intent": session.intent or self.INTENT_UNKNOWN,
            "data": session.collected_data or {},
            "missing_fields": session.missing_fields or [],
        }
