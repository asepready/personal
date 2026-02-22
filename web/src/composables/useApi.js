/**
 * Base URL untuk panggilan API backend.
 * Dev: proxy Vite mengirim /api, /login, /status ke backend.
 * Build: set VITE_API_URL (mis. https://api.example.com) bila frontend beda origin.
 */
export function useApiBase() {
  const base = import.meta.env.VITE_API_URL ?? ''
  const root = base ? base.replace(/\/$/, '') : ''

  /** Path absolut: root + path atau path saja bila root kosong. */
  function apiPath(path) {
    return root ? `${root}${path}` : path
  }

  /** Path dengan slug (encode URI). */
  function apiPathSlug(prefix, slug) {
    return apiPath(`${prefix}/${encodeURIComponent(slug)}`)
  }

  return {
    apiBase: base,
    skillsUrl: () => apiPath('/api/skills'),
    projectsUrl: () => apiPath('/api/projects'),
    projectBySlugUrl: (slug) => apiPathSlug('/api/projects', slug),
    postsUrl: () => apiPath('/api/posts'),
    postBySlugUrl: (slug) => apiPathSlug('/api/posts', slug),
    loginUrl: () => apiPath('/login'),
    statusUrl: () => apiPath('/api/status'),
    adminUrl: () => apiPath('/admin'),
    adminCategoriesUrl: () => apiPath('/admin/skill-categories'),
    adminSkillsUrl: () => apiPath('/admin/skills'),
  }
}
