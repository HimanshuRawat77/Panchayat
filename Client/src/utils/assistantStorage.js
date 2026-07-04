import { getAuthUser } from './authStorage';

const ASSISTANT_STORAGE_PREFIX = 'panchayatAiChat';

function resolveUserId(user = getAuthUser()) {
  return user?.id || user?._id || '';
}

export function getAssistantStorageKey(user = getAuthUser()) {
  const userId = resolveUserId(user);
  return userId
    ? `${ASSISTANT_STORAGE_PREFIX}:${userId}`
    : ASSISTANT_STORAGE_PREFIX;
}

export function loadAssistantMessages(defaultMessages, user = getAuthUser()) {
  try {
    const saved = localStorage.getItem(getAssistantStorageKey(user));
    return saved ? JSON.parse(saved) : defaultMessages;
  } catch {
    return defaultMessages;
  }
}

export function saveAssistantMessages(messages, user = getAuthUser()) {
  localStorage.setItem(getAssistantStorageKey(user), JSON.stringify(messages));
}
