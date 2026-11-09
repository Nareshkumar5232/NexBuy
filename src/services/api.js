const envApiUrl = import.meta.env.VITE_API_URL;
const REMOTE_API_URL = 'https://byte-backend-mhke.onrender.com/api';

const RAW_API_URL =
  envApiUrl && envApiUrl.startsWith('http')
    ? envApiUrl
    : (import.meta.env.DEV ? (envApiUrl || '/api') : REMOTE_API_URL);

const API_BASE = RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL.replace(/\/+$/, '')}/api`;

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token, silent = false } = {}) {
  const finalToken =
    token ||
    localStorage.getItem('nexbuy_auth_token_v1') ||
    localStorage.getItem('nexbuy_admin_token_v1');
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (finalToken) {
    finalHeaders['Authorization'] = `Bearer ${finalToken}`;
  }

  const config = {
    method,
    headers: finalHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    let res = await fetch(`${API_BASE}${endpoint}`, config);

    // If local/relative host rejects POST with 405 (static host with no backend), retry with remote backend
    if (res.status === 405 && API_BASE.startsWith('/')) {
      res = await fetch(`${REMOTE_API_URL}${endpoint}`, config);
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!silent) {
      console.error(`API Request error [${method} ${endpoint}]:`, err);
    }
    throw err;
  }
}
