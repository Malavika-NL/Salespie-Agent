from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    AgentConfirmSerializer,
    AgentCorrectionSerializer,
    AgentMessageSerializer,
    AudioAgentConfirmSerializer,
    AudioAgentPreviewSerializer,
)
from .services import OfflineAccountAgentService, OfflineVoiceCRMService


@method_decorator(csrf_exempt, name="dispatch")
class AgentMessageView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    service_class = OfflineAccountAgentService

    def post(self, request):
        serializer = AgentMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.service_class()
        payload = service.handle_message(
            request.user,
            serializer.validated_data.get("session_id"),
            serializer.validated_data["text"],
        )
        return Response(payload, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class AgentCorrectView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    service_class = OfflineAccountAgentService

    def post(self, request):
        serializer = AgentCorrectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.service_class()
        try:
            payload = service.apply_correction(
                request.user,
                serializer.validated_data["session_id"],
                serializer.validated_data["corrected_data"],
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class AgentConfirmView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    service_class = OfflineAccountAgentService

    def post(self, request):
        serializer = AgentConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.service_class()
        try:
            payload = service.confirm(
                request.user,
                serializer.validated_data["session_id"],
                serializer.validated_data.get("allow_partial_save", False),
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class AgentAudioPreviewView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    service_class = OfflineVoiceCRMService

    def post(self, request):
        serializer = AudioAgentPreviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.service_class()
        try:
            payload = service.preview_from_audio(
                request.user,
                serializer.validated_data["audio_file"],
                serializer.validated_data.get("session_id"),
            )
        except RuntimeError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(payload, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class AgentAudioConfirmView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    service_class = OfflineVoiceCRMService

    def post(self, request):
        serializer = AudioAgentConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.service_class()
        try:
            payload = service.confirm_preview(
                request.user,
                serializer.validated_data["session_id"],
                serializer.validated_data.get("corrected_data"),
                serializer.validated_data.get("save_to_db", False),
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        return Response(payload, status=status.HTTP_200_OK)
