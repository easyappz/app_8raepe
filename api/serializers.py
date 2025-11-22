from rest_framework import serializers

from .models import ChatMessage, Member


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "email", "created_at", "updated_at"]
        read_only_fields = fields


class MemberRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=128)

    class Meta:
        model = Member
        fields = ["id", "email", "password", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class MemberLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, max_length=128)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        try:
            member = Member.objects.get(email=email)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")
        if not member.check_password(password):
            raise serializers.ValidationError("Invalid credentials.")
        attrs["member"] = member
        return attrs


class ChatMessageSerializer(serializers.ModelSerializer):
    member = MemberProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "member", "text", "created_at"]
        read_only_fields = ["id", "member", "created_at"]
