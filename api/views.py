from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .authentication import TokenAuthentication
from .models import AuthToken, ChatMessage
from .serializers import (
    ChatMessageSerializer,
    MemberLoginSerializer,
    MemberProfileSerializer,
    MemberRegistrationSerializer,
    MessageSerializer,
)


class HelloView(APIView):
    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    @extend_schema(request=MemberRegistrationSerializer, responses={201: MemberProfileSerializer})
    def post(self, request):
        serializer = MemberRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        token = AuthToken.objects.create(member=member)
        profile_data = MemberProfileSerializer(member).data
        return Response({"token": str(token.key), "member": profile_data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    @extend_schema(request=MemberLoginSerializer, responses={200: MemberProfileSerializer})
    def post(self, request):
        serializer = MemberLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.validated_data["member"]
        token = AuthToken.objects.create(member=member)
        profile_data = MemberProfileSerializer(member).data
        return Response({"token": str(token.key), "member": profile_data})


class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: MemberProfileSerializer})
    def get(self, request):
        serializer = MemberProfileSerializer(request.user)
        return Response(serializer.data)


class ChatMessagesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: ChatMessageSerializer})
    def get(self, request):
        messages = ChatMessage.objects.select_related("member").order_by("-created_at")
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    @extend_schema(request=ChatMessageSerializer, responses={201: ChatMessageSerializer})
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save(member=request.user)
        output_serializer = ChatMessageSerializer(message)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
