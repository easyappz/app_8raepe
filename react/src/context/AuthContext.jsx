import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/profile';
import { AUTH_TOKEN_KEY } from '../api/helpers';

const AuthContext = createContext({
  token: '',
  profile: null,
  loadingProfile: false,
  login: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

const getInitialToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getInitialToken);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      return;
    }
    setLoadingProfile(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = useCallback(async nextToken => {
    if (!nextToken) {
      return;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    }
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    setToken('');
    setProfile(null);
  }, []);

  const value = {
    token,
    profile,
    loadingProfile,
    login,
    logout,
    refreshProfile: loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
