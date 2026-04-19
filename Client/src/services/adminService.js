import API_BASE_URL from '../config';

const API = API_BASE_URL;


const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const handle = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }
  if (response.status === 403) {
    throw new Error('Admin access required');
  }
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const getComplaintAnalytics = async () => {
  const res = await fetch(`${API}/complaints/analytics`, { headers: authHeaders() });
  return handle(res);
};

export const getAllComplaintsAdmin = async (query = {}) => {
  const q = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v != null && v !== '' && v !== 'all') q.set(k, v);
  });
  const qs = q.toString();
  const res = await fetch(`${API}/complaints/all${qs ? `?${qs}` : ''}`, {
    headers: authHeaders(),
  });
  return handle(res);
};

export const updateComplaintAdmin = async (id, body) => {
  const res = await fetch(`${API}/complaints/admin/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handle(res);
};

export const getUsersAdmin = async () => {
  const res = await fetch(`${API}/auth/users`, { headers: authHeaders() });
  return handle(res);
};

export const patchUserRoleAdmin = async (userId, role) => {
  const res = await fetch(`${API}/auth/users/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });
  return handle(res);
};

export const getWorkersAdmin = async () => {
  const res = await fetch(`${API}/workers`, { headers: authHeaders() });
  return handle(res);
};

export const createWorkerAdmin = async (payload) => {
  const res = await fetch(`${API}/workers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
};

export const updateWorkerAdmin = async (id, payload) => {
  const res = await fetch(`${API}/workers/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
};
