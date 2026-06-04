import API_BASE_URL from '../config';

const API_BASE = `${API_BASE_URL}/complaints`;


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

export const getAllComplaints = async () => {
  const response = await fetch(`${API_BASE}/all`, {
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
    throw new Error(data.message || 'Failed to fetch all complaints');
  }

  return data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await fetch(`${API_BASE}/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update complaint status');
  }

  return data;
};
