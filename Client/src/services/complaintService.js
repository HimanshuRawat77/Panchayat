const API_BASE = 'http://localhost:5001/api/complaints';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('No authentication token found in localStorage');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const createComplaint = async (payload) => {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create complaint');
  }

  return data;
};

export const getMyComplaints = async () => {
  const response = await fetch(`${API_BASE}/my`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch complaints');
  }

  return data;
};
