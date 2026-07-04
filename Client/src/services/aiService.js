import API_BASE_URL from '../config';
import { getAuthToken } from '../utils/authStorage';

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getSummary = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get AI summary');
    }

    return data.summary;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

export const askAssistant = async (question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question }),
    });

    const raw = await response.text();
    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error('Assistant returned an invalid response');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get AI answer');
    }

    return data;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(error.message || 'Failed to get AI answer');
  }
};

export const markTourSeen = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/tour-seen`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save tour preference');
    }

    return data;
  } catch (error) {
    console.error('Tour Service Error:', error);
    throw new Error(error.message || 'Failed to save tour preference');
  }
};
