const API_BASE = import.meta.env.VITE_API_URL || '';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw { status: res.status, message: data.message || 'Request failed', errors: data.errors };
  }
  return data;
}

export async function getUsers(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/users${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`);
  return handleResponse(res);
}

export async function getExperiences(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/experiences${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getEducations(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/educations${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getSkillCategories(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/skill-categories${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getSkills(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/skills${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getUserSkills(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/user-skills${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getProjects(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/projects${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getProject(id) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  return handleResponse(res);
}

export async function getBlogPosts(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/blog-posts${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function getBlogPost(id) {
  const res = await fetch(`${API_BASE}/api/blog-posts/${id}`);
  return handleResponse(res);
}

export async function getCertifications(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/certifications${q ? `?${q}` : ''}`);
  return handleResponse(res);
}

export async function postContactMessage(body) {
  const res = await fetch(`${API_BASE}/api/contact-messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
