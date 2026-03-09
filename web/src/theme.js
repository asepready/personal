const STORAGE_KEY = 'portfolio_web_theme'

export function getTheme() {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem(STORAGE_KEY) || 'dark')
}

export function setTheme(value) {
  const theme = value === 'light' ? 'light' : 'dark'
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
  }
  return theme
}

export function applyTheme(value) {
  const theme = value === 'light' ? 'light' : 'dark'
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export function initTheme() {
  const theme = getTheme()
  applyTheme(theme)
}
