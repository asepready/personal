import { getToken, clearToken } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw { status: 401, message: data.message || 'Unauthorized', errors: data.errors };
  }
  if (!res.ok) throw { status: res.status, message: data.message, errors: data.errors };
  return data;
}

/**
 * Login with username and password. Does not use auth header or handleRes (no redirect on 401).
 * Returns response body on success; throws on error.
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message || 'Login gagal', errors: data.errors };
  return data;
}

function jsonBody(body) {
  return { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) };
}

export function getList(resource, params = {}) {
  const q = new URLSearchParams(params).toString();
  return fetch(`${API_BASE}/api/${resource}${q ? `?${q}` : ''}`, { headers: authHeaders() }).then(handleRes);
}

export function getOne(resource, id) {
  return fetch(`${API_BASE}/api/${resource}/${id}`, { headers: authHeaders() }).then(handleRes);
}

export function create(resource, body) {
  return fetch(`${API_BASE}/api/${resource}`, { ...jsonBody(body), method: 'POST' }).then(handleRes);
}

export function update(resource, id, body) {
  return fetch(`${API_BASE}/api/${resource}/${id}`, { ...jsonBody(body), method: 'PUT' }).then(handleRes);
}

export function remove(resource, id) {
  return fetch(`${API_BASE}/api/${resource}/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handleRes);
}

export const resourceEndpoints = {
  users: 'users',
  experiences: 'experiences',
  educations: 'educations',
  'skill-categories': 'skill-categories',
  skills: 'skills',
  'user-skills': 'user-skills',
  projects: 'projects',
  'project-skills': 'project-skills',
  'blog-posts': 'blog-posts',
  tags: 'tags',
  'post-tags': 'post-tags',
  certifications: 'certifications',
  'contact-messages': 'contact-messages',
};
