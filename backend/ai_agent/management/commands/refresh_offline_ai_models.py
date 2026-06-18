from django.core.management.base import BaseCommand

from ai_agent.training.learning_pipeline import LearningPipeline
from ai_agent.training.train_custom_ner import train_custom_company_ner


class Command(BaseCommand):
    help = "Retrain the offline AI intent model and, when data is available, the company NER model."

    def handle(self, *args, **options):
        learning_pipeline = LearningPipeline()
        intent_path = learning_pipeline.retrain_intent_classifier()
        self.stdout.write(self.style.SUCCESS(f"Intent model refreshed at {intent_path}"))

        try:
            ner_path = train_custom_company_ner()
        except Exception as exc:  # pragma: no cover
            self.stdout.write(self.style.WARNING(f"Custom NER skipped: {exc}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Custom NER refreshed at {ner_path}"))
