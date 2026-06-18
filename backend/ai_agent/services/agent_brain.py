from __future__ import annotations

from pathlib import Path
from typing import Any

from ..nlp import CompanyExtractor, FieldMapper, IntentClassifier
from ..speech import OfflineSpeechToText
from ..utils import get_ai_agent_logger, normalize_agent_text


class OfflineVoiceAgentBrain:
    def __init__(self):
        self.logger = get_ai_agent_logger(__name__)
        self.speech_to_text = OfflineSpeechToText()
        self.intent_classifier = IntentClassifier()
        self.company_extractor = CompanyExtractor()
        self.field_mapper = FieldMapper()

    def process_audio(self, wav_path: str | Path) -> dict[str, Any]:
        result = self.process_audio_with_metadata(wav_path)
        return result["ai_output"]

    def process_audio_with_metadata(self, wav_path: str | Path) -> dict[str, Any]:
        transcript = self.speech_to_text.transcribe_wav(wav_path)
        ai_output = self.process_text(transcript)
        return {
            "transcript": transcript,
            "ai_output": ai_output,
        }

    def process_text(self, text: str) -> dict[str, Any]:
        normalized_text = normalize_agent_text(text)
        prediction = self.intent_classifier.predict(normalized_text)
        extracted_data = self.field_mapper.extract_fields(normalized_text)
        if not extracted_data.get("account_name"):
            extracted_data["account_name"] = self.company_extractor.extract_company_name(normalized_text) or ""

        payload = {
            "intent": prediction.intent,
            "confidence": round(float(prediction.confidence), 4),
            "extracted_data": {
                "account_name": extracted_data.get("account_name", ""),
                "mobile_number": extracted_data.get("mobile_number", ""),
                "email_id": extracted_data.get("email_id", ""),
                "address": extracted_data.get("address", ""),
                "website": extracted_data.get("website", ""),
            },
        }
        self.logger.info(
            "Processed voice request intent=%s confidence=%.3f",
            payload["intent"],
            payload["confidence"],
        )
        return payload
