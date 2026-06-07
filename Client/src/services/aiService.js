import API_BASE_URL from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get AI answer');
    }

    return data;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
