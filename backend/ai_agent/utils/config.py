from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
TRAINING_DIR = BASE_DIR / "training"
DATA_DIR = TRAINING_DIR / "data"
ARTIFACT_DIR = TRAINING_DIR / "artifacts"
LOG_DIR = BASE_DIR / "logs"


@dataclass(frozen=True)
class OfflineAIAgentSettings:
    whisper_model_size: str = os.getenv("AI_AGENT_WHISPER_MODEL", "small")
    whisper_device: str = os.getenv("AI_AGENT_WHISPER_DEVICE", "auto")
    whisper_language: str = os.getenv("AI_AGENT_WHISPER_LANGUAGE", "en")
    spacy_model_name: str = os.getenv("AI_AGENT_SPACY_MODEL", "en_core_web_sm")
    intent_model_path: Path = ARTIFACT_DIR / "intent_classifier.pkl"
    corrections_dataset_path: Path = DATA_DIR / "corrections.jsonl"
    intent_examples_path: Path = DATA_DIR / "intent_examples.jsonl"
    bootstrap_intent_examples_path: Path = DATA_DIR / "bootstrap_intents.jsonl"
    ner_examples_path: Path = DATA_DIR / "ner_examples.jsonl"
    custom_ner_model_dir: Path = ARTIFACT_DIR / "custom_ner"
    temp_audio_dir: Path = BASE_DIR / "tmp_audio"


def ensure_runtime_directories() -> None:
    for path in [TRAINING_DIR, DATA_DIR, ARTIFACT_DIR, LOG_DIR, BASE_DIR / "tmp_audio"]:
        path.mkdir(parents=True, exist_ok=True)


def get_ai_agent_settings() -> OfflineAIAgentSettings:
    ensure_runtime_directories()
    return OfflineAIAgentSettings()
