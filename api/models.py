import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.db import models


class Member(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    def __str__(self) -> str:
        return self.email


class AuthToken(models.Model):
    key = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    member = models.ForeignKey(Member, related_name="tokens", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.member.email}:{self.key}"


class ChatMessage(models.Model):
    member = models.ForeignKey(Member, related_name="messages", on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.member.email}: {self.text[:30]}"
