from __future__ import annotations

import re
from dataclasses import dataclass

from ..utils import normalize_agent_text
from .company_extractor import CompanyExtractor


@dataclass
class FieldExtractionResult:
    account_name: str = ""
    mobile_number: str = ""
    email_id: str = ""
    address: str = ""
    website: str = ""

    def as_dict(self) -> dict[str, str]:
        return {
            "account_name": self.account_name,
            "mobile_number": self.mobile_number,
            "email_id": self.email_id,
            "address": self.address,
            "website": self.website,
        }


class FieldMapper:
    def __init__(self):
        self.company_extractor = CompanyExtractor()

    def extract_fields(self, text: str) -> dict[str, str]:
        normalized = normalize_agent_text(text)
        result = FieldExtractionResult()

        result.email_id = self._extract_email(normalized)
        result.mobile_number = self._extract_phone(normalized)
        result.website = self._extract_website(normalized)
        result.address = self._extract_address(normalized)
        result.account_name = self.company_extractor.extract_company_name(normalized) or ""

        return result.as_dict()

    def _extract_email(self, text: str) -> str:
        match = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text)
        return match.group(0) if match else ""

    def _extract_phone(self, text: str) -> str:
        candidates = re.findall(r"(?<!\d)(?:\+?\d[\d()\-\s]{7,18}\d)(?!\d)", text)
        best = ""
        for candidate in candidates:
            digits = re.sub(r"\D", "", candidate)
            if len(digits) >= 10 and len(digits) > len(re.sub(r"\D", "", best)):
                best = digits
        return best

    def _extract_website(self, text: str) -> str:
        match = re.search(r"(?<!@)\b(?:https?://)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/\S*)?\b", text)
        if not match:
            return ""
        value = match.group(0)
        if "@" in value:
            return ""
        return value if value.startswith(("http://", "https://")) else f"https://{value}"

    def _extract_address(self, text: str) -> str:
        patterns = [
            r"(?:address is|address|located at|location is|located in)\s+(.+?)(?=(?:\b(?:phone|mobile|email|website|company|account|client)\b|$))",
            r"(?:at)\s+([A-Za-z0-9,./()#\- ]{10,})(?=(?:\b(?:phone|mobile|email|website)\b|$))",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                value = re.sub(r"\s+", " ", match.group(1)).strip(" .,-")
                if value:
                    return value
        return ""
