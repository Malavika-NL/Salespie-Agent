from django.contrib import admin

from .models import AgentCorrectionLog, AgentSessionMemory, AgentTrainingExample


@admin.register(AgentSessionMemory)
class AgentSessionMemoryAdmin(admin.ModelAdmin):
    list_display = ("session_id", "user", "intent", "current_state", "updated_at")
    search_fields = ("session_id", "intent", "last_user_input", "user__username", "user__email")


@admin.register(AgentTrainingExample)
class AgentTrainingExampleAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "intent", "created_at")
    search_fields = ("user_input", "intent", "user__username", "user__email")


@admin.register(AgentCorrectionLog)
class AgentCorrectionLogAdmin(admin.ModelAdmin):
    list_display = ("id", "session_id", "user", "created_at")
    search_fields = ("session_id", "user_input", "user__username", "user__email")

