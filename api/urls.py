from django.urls import path

from .views import ChatMessagesView, HelloView, LoginView, ProfileView, RegisterView

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("messages/", ChatMessagesView.as_view(), name="messages"),
]
