const AUTH_TOKEN_KEY = 'authToken';

export const getStoredToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const getAuthHeaders = () => {
  const token = getStoredToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Token ${token}`,
  };
};

export { AUTH_TOKEN_KEY };
