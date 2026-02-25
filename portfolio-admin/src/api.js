const API_BASE = import.meta.env.VITE_API_URL || '';

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message, errors: data.errors };
  return data;
}

function jsonBody(body) {
  return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export function getList(resource, params = {}) {
  const q = new URLSearchParams(params).toString();
  return fetch(`${API_BASE}/api/${resource}${q ? `?${q}` : ''}`).then(handleRes);
}

export function getOne(resource, id) {
  return fetch(`${API_BASE}/api/${resource}/${id}`).then(handleRes);
}

export function create(resource, body) {
  return fetch(`${API_BASE}/api/${resource}`, { ...jsonBody(body), method: 'POST' }).then(handleRes);
}

export function update(resource, id, body) {
  return fetch(`${API_BASE}/api/${resource}/${id}`, { ...jsonBody(body), method: 'PUT' }).then(handleRes);
}

export function remove(resource, id) {
  return fetch(`${API_BASE}/api/${resource}/${id}`, { method: 'DELETE' }).then(handleRes);
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
