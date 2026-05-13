import { API_URL } from '../config.js';

/**
 * Thin wrapper around fetch that attaches auth header + JSON content-type.
 * @param {string} path - API path (e.g. '/bookings')
 * @param {object} options - fetch options
 * @param {string} [token] - JWT token
 */
export const apiFetch = (path, options = {}, token = null) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_URL}${path}`, { ...options, headers });
};

/** GET helper */
export const apiGet = (path, token) =>
  apiFetch(path, { method: 'GET' }, token);

/** POST helper */
export const apiPost = (path, body, token) =>
  apiFetch(path, { method: 'POST', body: JSON.stringify(body) }, token);

/** DELETE helper */
export const apiDelete = (path, token) =>
  apiFetch(path, { method: 'DELETE' }, token);
