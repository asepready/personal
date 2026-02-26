const PORTFOLIO_ADMIN_TOKEN = 'portfolio_admin_token';
const PORTFOLIO_ADMIN_USER = 'portfolio_admin_user';

export function getToken() {
  try {
    return sessionStorage.getItem(PORTFOLIO_ADMIN_TOKEN);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem(PORTFOLIO_ADMIN_TOKEN, token);
  } catch (_) {}
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(PORTFOLIO_ADMIN_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    if (user) sessionStorage.setItem(PORTFOLIO_ADMIN_USER, JSON.stringify(user));
    else sessionStorage.removeItem(PORTFOLIO_ADMIN_USER);
  } catch (_) {}
}

export function clearToken() {
  try {
    sessionStorage.removeItem(PORTFOLIO_ADMIN_TOKEN);
    sessionStorage.removeItem(PORTFOLIO_ADMIN_USER);
  } catch (_) {}
}
