import API_BASE_URL from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getCommunityPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/community`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch community posts');
  }

  return data;
};

export const createCommunityPost = async ({ category, content }) => {
  const response = await fetch(`${API_BASE_URL}/community`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ category, content }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create community post');
  }

  return data;
};
