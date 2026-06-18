from __future__ import annotations

import threading
import wave
from pathlib import Path

import numpy as np

from ..utils import get_ai_agent_logger, get_ai_agent_settings, normalize_agent_text


class OfflineSpeechToText:
    _model = None
    _device = "cpu"
    _load_lock = threading.RLock()

    def __init__(self, model_size: str | None = None, device: str | None = None):
        settings = get_ai_agent_settings()
        self.model_size = model_size or settings.whisper_model_size
        self.device_preference = device or settings.whisper_device
        self.language = settings.whisper_language
        self.logger = get_ai_agent_logger(__name__)

    def transcribe_wav(self, wav_path: str | Path) -> str:
        audio = self._load_wav_as_float32(wav_path)
        model = self._get_model()
        result = model.transcribe(
            audio,
            language=self.language,
            task="transcribe",
            fp16=self._device == "cuda",
            condition_on_previous_text=False,
            initial_prompt="CRM account intake with company names, phone numbers, emails, and addresses.",
        )
        transcript = (result.get("text") or "").strip()
        normalized = normalize_agent_text(transcript)
        self.logger.info("Transcribed audio file %s into %s characters", wav_path, len(normalized))
        return normalized

    def _get_model(self):
        if self.__class__._model is not None:
            return self.__class__._model

        with self.__class__._load_lock:
            if self.__class__._model is not None:
                return self.__class__._model

            try:
                import whisper
            except ImportError as exc:  # pragma: no cover
                raise RuntimeError(
                    "The offline speech pipeline requires the 'openai-whisper' package to be installed locally."
                ) from exc

            device = self._resolve_device()
            self.logger.info("Loading Whisper model '%s' on device '%s'", self.model_size, device)
            self.__class__._model = whisper.load_model(self.model_size, device=device)
            self.__class__._device = device
            return self.__class__._model

    def _resolve_device(self) -> str:
        if self.device_preference and self.device_preference.lower() in {"cpu", "cuda"}:
            return self.device_preference.lower()
        try:
            import torch
        except ImportError:
            return "cpu"
        return "cuda" if torch.cuda.is_available() else "cpu"

    def _load_wav_as_float32(self, wav_path: str | Path) -> np.ndarray:
        wav_path = Path(wav_path)
        with wave.open(str(wav_path), "rb") as wav_file:
            channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            frame_rate = wav_file.getframerate()
            frame_count = wav_file.getnframes()
            pcm = wav_file.readframes(frame_count)
        dtype = np.int16 if sample_width <= 2 else np.int32
        audio = np.frombuffer(pcm, dtype=dtype).astype(np.float32)

        if channels > 1:
            audio = audio.reshape(-1, channels).mean(axis=1)

        if frame_rate != 16000 and audio.size:
            duration = audio.shape[0] / float(frame_rate)
            target_size = max(int(duration * 16000), 1)
            source_positions = np.linspace(0, audio.shape[0] - 1, num=audio.shape[0], dtype=np.float32)
            target_positions = np.linspace(0, audio.shape[0] - 1, num=target_size, dtype=np.float32)
            audio = np.interp(target_positions, source_positions, audio).astype(np.float32)

        scale = float(np.iinfo(dtype).max) or 1.0
        audio /= scale
        return np.clip(audio, -1.0, 1.0)
