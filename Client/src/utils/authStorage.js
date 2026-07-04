const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function safeParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStorageMode() {
  if (sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(USER_KEY)) {
    return sessionStorage;
  }

  return localStorage;
}

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
}

export function getAuthUser() {
  return (
    safeParse(sessionStorage.getItem(USER_KEY)) ||
    safeParse(localStorage.getItem(USER_KEY)) ||
    null
  );
}

export function setSessionAuth({ token, user }) {
  clearAuth();
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setPersistentAuth({ token, user }) {
  clearAuth();
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(user) {
  const storage = getStorageMode();
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(USER_KEY);
  }
}

export function clearAuth() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isSessionAuth() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(USER_KEY));
}
