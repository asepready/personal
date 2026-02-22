/**
 * Base URL untuk panggilan API backend.
 * Dev: proxy Vite mengirim /api, /login, /status ke backend.
 * Build: set VITE_API_URL (mis. https://api.example.com) bila frontend beda origin.
 */
export function useApiBase() {
  const base = import.meta.env.VITE_API_URL ?? ''
  return {
    apiBase: base,
    /** URL untuk GET /api/skills */
    skillsUrl() {
      return base ? `${base.replace(/\/$/, '')}/api/skills` : '/api/skills'
    },
    /** URL untuk POST /login */
    loginUrl() {
      return base ? `${base.replace(/\/$/, '')}/login` : '/login'
    },
    /** URL untuk GET /status */
    statusUrl() {
      return base ? `${base.replace(/\/$/, '')}/status` : '/status'
    },
    /** URL untuk GET /admin (Bearer token) */
    adminUrl() {
      return base ? `${base.replace(/\/$/, '')}/admin` : '/admin'
    },
    /** URL untuk CRUD /admin/skill-categories */
    adminCategoriesUrl() {
      return base ? `${base.replace(/\/$/, '')}/admin/skill-categories` : '/admin/skill-categories'
    },
    /** URL untuk CRUD /admin/skills */
    adminSkillsUrl() {
      return base ? `${base.replace(/\/$/, '')}/admin/skills` : '/admin/skills'
    },
  }
}
