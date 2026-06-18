from __future__ import annotations

import json
import random

from ..utils import get_ai_agent_logger, get_ai_agent_settings


def train_custom_company_ner(iterations: int = 12) -> str:
    logger = get_ai_agent_logger(__name__)
    settings = get_ai_agent_settings()
    if not settings.ner_examples_path.exists():
        raise FileNotFoundError(
            f"No NER examples found at {settings.ner_examples_path}. Confirm a few company corrections first."
        )

    try:
        import spacy
        from spacy.training import Example
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError("spaCy must be installed locally to train the company NER model.") from exc

    examples = []
    with settings.ner_examples_path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            entities = [tuple(item) for item in row.get("entities", [])]
            if row.get("text") and entities:
                examples.append((row["text"], {"entities": entities}))

    if not examples:
        raise ValueError("NER dataset is empty.")

    nlp = spacy.load(settings.spacy_model_name)
    ner = nlp.get_pipe("ner")
    ner.add_label("ORG")

    optimizer = nlp.resume_training()
    for iteration in range(iterations):
        random.shuffle(examples)
        losses = {}
        for text, annotations in examples:
            example = Example.from_dict(nlp.make_doc(text), annotations)
            nlp.update([example], sgd=optimizer, losses=losses)
        logger.info("Custom NER iteration %s losses=%s", iteration + 1, losses)

    settings.custom_ner_model_dir.mkdir(parents=True, exist_ok=True)
    nlp.to_disk(settings.custom_ner_model_dir)
    logger.info("Saved custom spaCy model to %s", settings.custom_ner_model_dir)
    return str(settings.custom_ner_model_dir)


def main() -> None:
    train_custom_company_ner()


if __name__ == "__main__":
    main()
