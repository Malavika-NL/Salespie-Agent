from __future__ import annotations

import re
import threading
from dataclasses import dataclass
from difflib import SequenceMatcher

from ..utils import get_ai_agent_logger, get_ai_agent_settings, normalize_agent_text


COMPANY_SUFFIXES = (
    "pvt ltd",
    "private limited",
    "llp",
    "limited",
    "technologies",
    "technology",
    "solutions",
    "enterprises",
    "systems",
    "industries",
    "corp",
    "corporation",
)


@dataclass
class CompanyCandidate:
    name: str
    score: float
    source: str


class CompanyExtractor:
    _nlp = None
    _lock = threading.RLock()

    def __init__(self, prefer_custom_model: bool = True):
        settings = get_ai_agent_settings()
        self.spacy_model_name = settings.spacy_model_name
        self.custom_model_dir = settings.custom_ner_model_dir
        self.prefer_custom_model = prefer_custom_model
        self.logger = get_ai_agent_logger(__name__)

    def extract_best_company(self, text: str) -> CompanyCandidate | None:
        candidates = self.extract_candidates(text)
        return max(candidates, key=lambda candidate: candidate.score) if candidates else None

    def extract_company_name(self, text: str) -> str | None:
        candidate = self.extract_best_company(text)
        return candidate.name if candidate else None

    def extract_candidates(self, text: str) -> list[CompanyCandidate]:
        raw_text = str(text or "").strip()
        normalized_text = normalize_agent_text(raw_text)
        candidates: list[CompanyCandidate] = []
        seen: set[tuple[str, str]] = set()

        for source_text, source_name in ((raw_text, "raw"), (normalized_text, "normalized")):
            if not source_text:
                continue
            for candidate in self._extract_org_entities(source_text):
                self._append_candidate(candidates, seen, candidate)
            fallback = self._fallback_extract(source_text)
            if fallback:
                self._append_candidate(candidates, seen, fallback)
            for candidate in self._extract_domain_based_candidates(source_text):
                self._append_candidate(candidates, seen, candidate)

        return sorted(candidates, key=lambda candidate: candidate.score, reverse=True)

    def _extract_org_entities(self, text: str) -> list[CompanyCandidate]:
        try:
            nlp = self._get_nlp()
        except RuntimeError:
            return []

        doc = nlp(text)
        candidates: list[CompanyCandidate] = []
        for entity in doc.ents:
            if entity.label_ != "ORG":
                continue
            cleaned = self._clean_company_name(entity.text)
            if not cleaned:
                continue
            score = 1.0 + self._heuristic_boost(cleaned)
            candidates.append(CompanyCandidate(name=cleaned, score=score, source="spacy_org"))
        return candidates

    def _get_nlp(self):
        if self.__class__._nlp is not None:
            return self.__class__._nlp

        with self.__class__._lock:
            if self.__class__._nlp is not None:
                return self.__class__._nlp

            try:
                import spacy
            except ImportError as exc:  # pragma: no cover
                raise RuntimeError(
                    "The offline company extractor requires spaCy to be installed locally."
                ) from exc

            if self.prefer_custom_model and self.custom_model_dir.exists():
                self.logger.info("Loading custom spaCy NER model from %s", self.custom_model_dir)
                self.__class__._nlp = spacy.load(self.custom_model_dir)
            else:
                self.logger.info("Loading spaCy model %s", self.spacy_model_name)
                self.__class__._nlp = spacy.load(self.spacy_model_name)
            return self.__class__._nlp

    def _heuristic_boost(self, value: str) -> float:
        lowered = value.lower()
        boost = 0.0
        for suffix in COMPANY_SUFFIXES:
            if suffix in lowered:
                boost += 1.25
        if any(char.isupper() for char in value):
            boost += 0.25
        token_count = len(re.findall(r"[A-Za-z0-9&().'-]+", value))
        boost += min(token_count * 0.1, 0.5)
        return boost

    def _append_candidate(
        self,
        candidates: list[CompanyCandidate],
        seen: set[tuple[str, str]],
        candidate: CompanyCandidate,
    ) -> None:
        key = (self._normalize_company_text(candidate.name), candidate.source)
        if not candidate.name or key in seen:
            return
        seen.add(key)
        candidates.append(candidate)

    def _fallback_extract(self, text: str) -> CompanyCandidate | None:
        patterns = [
            r"(?:company|account|client)\s+(?:name\s+is|is|named|called)\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone|mobile|email|address|website)\b|$))",
            r"(?:create|add|save|store|register|update)\s+(?:an?\s+)?(?:account|company|client)(?:\s+for|\s+of)?\s+([A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone|mobile|email|address|website)\b|$))",
            r"(?:from|at|for)\s+([A-Z][A-Za-z0-9&().,\- ]+?)(?=(?:\b(?:phone|mobile|email|address|website|whose|with)\b|$))",
            r"['\"]([A-Za-z0-9&().,\- ]{2,})['\"]",
        ]
        clauses = [text] + [part.strip() for part in re.split(r"[,;\n]", text) if part.strip()]
        best: CompanyCandidate | None = None
        for clause in clauses:
            for pattern in patterns:
                match = re.search(pattern, clause, flags=re.IGNORECASE)
                if not match:
                    continue
                cleaned = self._clean_company_name(match.group(1))
                if not cleaned:
                    continue
                candidate = CompanyCandidate(
                    name=cleaned,
                    score=0.6 + self._heuristic_boost(cleaned),
                    source="fallback_pattern",
                )
                if best is None or candidate.score > best.score:
                    best = candidate
        return best

    def _extract_domain_based_candidates(self, text: str) -> list[CompanyCandidate]:
        candidates: list[CompanyCandidate] = []
        for match in re.findall(r"\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b", text):
            candidate = self._company_from_domain(match)
            if candidate:
                candidates.append(candidate)
        for match in re.findall(r"\b(?:https?://)?(?:www\.)?([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b", text):
            candidate = self._company_from_domain(match)
            if candidate:
                candidates.append(candidate)
        return candidates

    def _company_from_domain(self, domain: str) -> CompanyCandidate | None:
        root = (domain or "").split("/")[0].split(".")[0]
        if not root:
            return None
        root = re.sub(r"[^A-Za-z0-9]+", " ", root)
        root = re.sub(r"([a-z])([A-Z])", r"\1 \2", root)
        words = [word for word in root.split() if len(word) > 1]
        if not words:
            return None
        name = " ".join(word.capitalize() for word in words)
        cleaned = self._clean_company_name(name)
        if not cleaned:
            return None
        return CompanyCandidate(
            name=cleaned,
            score=0.45 + self._heuristic_boost(cleaned),
            source="domain_hint",
        )

    def _clean_company_name(self, value: str) -> str:
        cleaned = re.sub(r"\s+", " ", str(value or "")).strip(" .,-'\"")
        cleaned = re.sub(r"^(?:for|of|the|named|called|from|at)\s+", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(
            r"\b(?:whose|with|phone|mobile|email|address|website|contact|number|details|data)\b.*$",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"\b(?:please|kindly|create|add|save|store|update|with|phone|mobile|email)\b\s*$",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
        return re.sub(r"\s+", " ", cleaned).strip(" .,-'\"")

    def match_against_reference_names(self, candidate_name: str, reference_names: list[str]) -> CompanyCandidate | None:
        normalized_candidate = self._normalize_company_text(candidate_name)
        if not normalized_candidate or not reference_names:
            return None

        best_name = ""
        best_score = 0.0
        for reference_name in reference_names:
            normalized_reference = self._normalize_company_text(reference_name)
            if not normalized_reference:
                continue
            score = SequenceMatcher(None, normalized_candidate, normalized_reference).ratio()
            if normalized_candidate in normalized_reference or normalized_reference in normalized_candidate:
                score += 0.08
            if score > best_score:
                best_score = score
                best_name = reference_name

        if best_score < 0.88:
            return None
        return CompanyCandidate(name=best_name, score=best_score, source="reference_match")

    def _normalize_company_text(self, value: str) -> str:
        normalized = normalize_agent_text(value).lower()
        normalized = re.sub(r"[^a-z0-9]+", " ", normalized)
        return re.sub(r"\b(?:pvt|private|ltd|limited|llp|inc|corp|corporation|company|co|technologies|technology|solutions|systems|enterprises)\b", " ", normalized).strip()

    @staticmethod
    def custom_ner_training_notes() -> str:
        return (
            "To improve company extraction later, collect confirmed corrections in ner_examples.jsonl, "
            "annotate account_name spans as ORG, then run: "
            "'python -m ai_agent.training.train_custom_ner'. "
            "Start from en_core_web_sm, freeze unrelated components, and retrain only the NER head."
        )
