import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getTheme, setTheme } from '../theme'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/pengalaman', label: 'Pengalaman' },
  { to: '/pendidikan', label: 'Pendidikan' },
  { to: '/skills', label: 'Skills' },
  { to: '/proyek', label: 'Proyek' },
  { to: '/blog', label: 'Blog' },
  { to: '/sertifikasi', label: 'Sertifikasi' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setThemeState] = useState('dark')
  const location = useLocation()

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>Portfolio</Link>
        <nav className={`header-nav ${open ? 'header-nav-open' : ''}`} style={{ ...styles.nav, ...(open ? styles.navOpen : {}) }}>
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.navLink,
                ...(location.pathname === to ? styles.navLinkActive : {}),
              }}
              onClick={() => setOpen(false)}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            className="header-theme-toggle"
            aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
            title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
            onClick={handleToggleTheme}
            style={styles.themeBtn}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
        <button
          type="button"
          className="header-menu-btn"
          aria-label="Toggle menu"
          style={styles.menuBtn}
          onClick={() => setOpen((o) => !o)}
        >
          <span style={styles.menuIcon}>{open ? '✕' : '☰'}</span>
        </button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    position: 'relative',
  },
  logo: {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: 'var(--color-text)',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text)',
    fontSize: '1.5rem',
    padding: '0.25rem',
  },
  menuIcon: {},
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  themeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    padding: '0.25rem',
    cursor: 'pointer',
  },
  navOpen: {
    display: 'flex',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'var(--color-surface)',
    flexDirection: 'column',
    padding: '1rem',
    borderBottom: '1px solid var(--color-border)',
  },
  navLink: {
    color: 'var(--color-text-muted)',
    fontWeight: 500,
  },
  navLinkActive: {
    color: 'var(--color-primary)',
  },
}
