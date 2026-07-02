const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('moodo_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // response might not be JSON (e.g., empty or no-content responses)
  }

  if (!response.ok) {
    const errorMessage = data?.message || `HTTP Error ${response.status}: Something went wrong ❌`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.errors = data?.errors || [];
    throw error;
  }

  return data;
};
