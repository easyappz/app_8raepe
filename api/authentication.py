from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .models import AuthToken


class TokenAuthentication(BaseAuthentication):
    keyword = "Token"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if not auth:
            return None
        if auth[0].decode().lower() != self.keyword.lower():
            return None
        if len(auth) != 2:
            raise AuthenticationFailed("Invalid token header.")
        token_key = auth[1].decode()
        try:
            token = AuthToken.objects.select_related("member").get(key=token_key)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed("Invalid token.")
        return token.member, token
