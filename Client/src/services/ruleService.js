import API_BASE_URL from "../config";

const API = `${API_BASE_URL}/rules`;


const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// get all rules
export const getRules = async () => {
  const res = await fetch(API);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch rules");
  }
  return data;
};

// add rule (admin)
export const addRule = async (data) => {
  const res = await fetch(`${API}/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to add rule");
  }
  return result;
};

export const updateRule = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to update rule");
  }
  return result;
};

export const deleteRule = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to delete rule");
  }
  return result;
};