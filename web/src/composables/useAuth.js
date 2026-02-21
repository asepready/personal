const TOKEN_KEY = 'admin_token'

export function useAuth() {
  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  }

  function setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (_) {}
  }

  function isLoggedIn() {
    return !!getToken()
  }

  return { getToken, setToken, logout, isLoggedIn }
}
