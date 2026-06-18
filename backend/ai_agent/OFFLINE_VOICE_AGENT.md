# Offline Voice CRM Agent

This package runs fully offline on a laptop and uses only local Python components.

## Folder layout

- `speech/`: local Whisper speech-to-text
- `nlp/`: intent classification, company extraction, field mapping
- `training/`: datasets, retraining scripts, learning pipeline
- `services/`: orchestration and Django CRM integration
- `utils/`: shared config, logging, and text normalization

## Local dependencies

Recommended offline packages:

- `openai-whisper`
- `torch`
- `spacy`
- `en_core_web_sm`
- `scikit-learn`

Example setup:

```powershell
pip install openai-whisper torch spacy
python -m spacy download en_core_web_sm
python -m ai_agent.training.train_intent_model
```

## Audio flow

1. Upload WAV audio to Django
2. Save a temporary local copy
3. Run `OfflineVoiceAgentBrain.process_audio(...)`
4. Return preview JSON to the UI
5. Save only after user confirmation

## Retraining

Intent retraining:

```powershell
python -m ai_agent.training.train_intent_model
```

Custom company NER retraining:

```powershell
python -m ai_agent.training.train_custom_ner
```

## Periodic scheduling

Windows Task Scheduler:

```powershell
python D:\SalesPie\backend\manage.py refresh_offline_ai_models
```

Linux/macOS cron:

```cron
0 2 * * * cd /path/to/backend && python manage.py refresh_offline_ai_models
```
