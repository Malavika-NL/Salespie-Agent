from rest_framework import serializers


class AgentMessageSerializer(serializers.Serializer):
    session_id = serializers.CharField(required=False, allow_blank=True)
    text = serializers.CharField()


class AgentCorrectionSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    corrected_data = serializers.JSONField()


class AgentConfirmSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    allow_partial_save = serializers.BooleanField(required=False, default=False)


class AudioAgentPreviewSerializer(serializers.Serializer):
    session_id = serializers.CharField(required=False, allow_blank=True)
    audio_file = serializers.FileField()

    def validate_audio_file(self, value):
        name = (value.name or "").lower()
        if not name.endswith(".wav"):
            raise serializers.ValidationError("Only WAV audio files are supported for the offline voice agent.")
        return value


class AudioAgentConfirmSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    corrected_data = serializers.JSONField(required=False)
    save_to_db = serializers.BooleanField(required=False, default=False)
