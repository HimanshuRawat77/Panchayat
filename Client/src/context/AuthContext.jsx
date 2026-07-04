/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuth,
  getAuthToken,
  getAuthUser,
  setPersistentAuth,
  setSessionAuth,
} from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [authToken, setAuthToken] = useState(() => getAuthToken());

  const syncAuthState = useCallback(() => {
    setAuthUser(getAuthUser());
    setAuthToken(getAuthToken());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => syncAuthState();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAuthState]);

  const loginWithSession = useCallback(({ token, user }) => {
    setSessionAuth({ token, user });
    setAuthUser(user || null);
    setAuthToken(token || '');
  }, []);

  const loginPersistently = useCallback(({ token, user }) => {
    setPersistentAuth({ token, user });
    setAuthUser(user || null);
    setAuthToken(token || '');
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthUser(null);
    setAuthToken('');
  }, []);

  const value = useMemo(
    () => ({
      authToken,
      authUser,
      isAuthenticated: Boolean(authToken),
      loginPersistently,
      loginWithSession,
      logout,
      refreshAuth: syncAuthState,
    }),
    [authToken, authUser, loginPersistently, loginWithSession, logout, syncAuthState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

export default AuthContext;
