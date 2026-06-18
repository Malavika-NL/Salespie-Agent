from __future__ import annotations

import json
import pickle
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from ..utils import get_ai_agent_logger, get_ai_agent_settings, normalize_agent_text


SUPPORTED_INTENTS = ("create_account", "update_account", "search_account", "unknown")


@dataclass
class IntentPrediction:
    intent: str
    confidence: float
    probabilities: dict[str, float]


class IntentClassifier:
    _pipeline: Pipeline | None = None
    _lock = threading.RLock()

    def __init__(self, model_path: str | Path | None = None):
        settings = get_ai_agent_settings()
        self.model_path = Path(model_path or settings.intent_model_path)
        self.intent_examples_path = settings.intent_examples_path
        self.bootstrap_examples_path = settings.bootstrap_intent_examples_path
        self.logger = get_ai_agent_logger(__name__)

    def predict(self, text: str) -> IntentPrediction:
        normalized = normalize_agent_text(text)
        model = self.load_model()
        probabilities = model.predict_proba([normalized])[0]
        labels = model.classes_
        label_scores = {label: float(score) for label, score in zip(labels, probabilities)}
        best_intent = max(label_scores, key=label_scores.get)
        return IntentPrediction(
            intent=best_intent if best_intent in SUPPORTED_INTENTS else "unknown",
            confidence=label_scores.get(best_intent, 0.0),
            probabilities=label_scores,
        )

    def load_model(self) -> Pipeline:
        if self.__class__._pipeline is not None:
            return self.__class__._pipeline

        with self.__class__._lock:
            if self.__class__._pipeline is not None:
                return self.__class__._pipeline

            if not self.model_path.exists():
                self.logger.info("Intent model not found at %s. Training a local bootstrap model.", self.model_path)
                self.train()

            with self.model_path.open("rb") as handle:
                self.__class__._pipeline = pickle.load(handle)
            return self.__class__._pipeline

    def train(self, extra_examples: list[dict[str, str]] | None = None) -> Path:
        examples = self._load_examples()
        if extra_examples:
            examples.extend(extra_examples)

        filtered = [
            example for example in examples
            if example.get("intent") in SUPPORTED_INTENTS and example.get("text")
        ]
        if not filtered:
            raise ValueError("No labeled intent examples were found for training.")

        texts = [normalize_agent_text(example["text"]) for example in filtered]
        intents = [example["intent"] for example in filtered]
        pipeline = Pipeline(
            steps=[
                (
                    "tfidf",
                    TfidfVectorizer(
                        lowercase=True,
                        ngram_range=(1, 2),
                        min_df=1,
                        max_df=0.98,
                    ),
                ),
                (
                    "classifier",
                    LogisticRegression(
                        max_iter=300,
                        class_weight="balanced",
                        multi_class="auto",
                        random_state=42,
                    ),
                ),
            ]
        )
        pipeline.fit(texts, intents)
        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        with self.model_path.open("wb") as handle:
            pickle.dump(pipeline, handle)
        self.__class__._pipeline = pipeline
        self.logger.info("Intent model trained with %s examples", len(filtered))
        return self.model_path

    def invalidate_cache(self) -> None:
        with self.__class__._lock:
            self.__class__._pipeline = None

    def _load_examples(self) -> list[dict[str, str]]:
        examples: list[dict[str, str]] = []
        for path in [self.bootstrap_examples_path, self.intent_examples_path]:
            if not path.exists():
                continue
            with path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        record = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    if record.get("text") and record.get("intent"):
                        examples.append(record)
        return examples


def train_intent_model(extra_examples: list[dict[str, str]] | None = None) -> Path:
    classifier = IntentClassifier()
    return classifier.train(extra_examples=extra_examples)


def load_intent_model() -> Pipeline:
    return IntentClassifier().load_model()


def predict_intent(text: str) -> dict[str, Any]:
    prediction = IntentClassifier().predict(text)
    return {
        "intent": prediction.intent,
        "confidence": prediction.confidence,
        "probabilities": prediction.probabilities,
    }


if __name__ == "__main__":
    train_intent_model()
