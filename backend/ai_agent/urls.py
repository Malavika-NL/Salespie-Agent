from django.urls import path

from .views import (
    AgentAudioConfirmView,
    AgentAudioPreviewView,
    AgentConfirmView,
    AgentCorrectView,
    AgentMessageView,
)


urlpatterns = [
    path("message/", AgentMessageView.as_view(), name="ai-agent-message"),
    path("correct/", AgentCorrectView.as_view(), name="ai-agent-correct"),
    path("confirm/", AgentConfirmView.as_view(), name="ai-agent-confirm"),
    path("audio/preview/", AgentAudioPreviewView.as_view(), name="ai-agent-audio-preview"),
    path("audio/confirm/", AgentAudioConfirmView.as_view(), name="ai-agent-audio-confirm"),
]
