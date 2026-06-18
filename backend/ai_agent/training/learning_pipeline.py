from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from ..nlp.company_extractor import CompanyExtractor
from ..nlp.intent_model import IntentClassifier
from ..utils import get_ai_agent_logger, get_ai_agent_settings, normalize_agent_text


class LearningPipeline:
    def __init__(self):
        self.settings = get_ai_agent_settings()
        self.logger = get_ai_agent_logger(__name__)

    def log_correction(
        self,
        original_text: str,
        corrected_output: dict[str, str],
        confirmed_intent: str | None = None,
    ) -> None:
        record = {
            "timestamp": datetime.utcnow().isoformat(),
            "text": normalize_agent_text(original_text),
            "intent": confirmed_intent or "unknown",
            "corrected_output": corrected_output,
        }
        self._append_jsonl(self.settings.corrections_dataset_path, record)
        if confirmed_intent:
            self._append_jsonl(
                self.settings.intent_examples_path,
                {"text": record["text"], "intent": confirmed_intent},
            )
        self._maybe_append_ner_example(record["text"], corrected_output)
        self.logger.info("Logged learning example for intent=%s", record["intent"])

    def retrain_intent_classifier(self) -> Path:
        classifier = IntentClassifier()
        classifier.invalidate_cache()
        return classifier.train()

    def _maybe_append_ner_example(self, text: str, corrected_output: dict[str, str]) -> None:
        account_name = (corrected_output or {}).get("account_name", "").strip()
        if not account_name:
            return
        lowered_text = text.lower()
        lowered_name = account_name.lower()
        start = lowered_text.find(lowered_name)
        if start < 0:
            return
        end = start + len(account_name)
        record = {
            "text": text,
            "entities": [[start, end, "ORG"]],
            "account_name": account_name,
        }
        self._append_jsonl(self.settings.ner_examples_path, record)

    def _append_jsonl(self, path: Path, record: dict) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=True) + "\n")

    @staticmethod
    def periodic_retraining_notes() -> str:
        return (
            "Windows Task Scheduler example: run "
            "'python D:\\SalesPie\\backend\\manage.py refresh_offline_ai_models' nightly. "
            "Linux/macOS cron example: 0 2 * * * cd /path/to/backend && python manage.py refresh_offline_ai_models"
        )

    @staticmethod
    def custom_ner_notes() -> str:
        return CompanyExtractor.custom_ner_training_notes()
