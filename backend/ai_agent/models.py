import uuid

from django.conf import settings
from django.db import models


class AgentSessionMemory(models.Model):
    session_id = models.CharField(max_length=64, unique=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="agent_sessions",
        null=True,
        blank=True,
    )
    intent = models.CharField(max_length=64, blank=True, default="")
    current_state = models.CharField(max_length=64, blank=True, default="START")
    collected_data = models.JSONField(default=dict, blank=True)
    missing_fields = models.JSONField(default=list, blank=True)
    last_user_input = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.session_id} ({self.intent or 'unknown'})"


class AgentTrainingExample(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="agent_training_examples",
        null=True,
        blank=True,
    )
    user_input = models.TextField()
    intent = models.CharField(max_length=64)
    corrected_output = models.JSONField(default=dict, blank=True)
    model_fields = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.intent}: {self.user_input[:50]}"


class AgentCorrectionLog(models.Model):
    session_id = models.CharField(max_length=64, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="agent_correction_logs",
        null=True,
        blank=True,
    )
    original_output = models.JSONField(default=dict, blank=True)
    corrected_output = models.JSONField(default=dict, blank=True)
    user_input = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.session_id} @ {self.created_at:%Y-%m-%d %H:%M:%S}"

