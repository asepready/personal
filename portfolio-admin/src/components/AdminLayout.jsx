import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../auth'
import { getTheme, setTheme } from '../theme'

const menuGroups = [
  { groupLabel: 'Utama', items: [{ to: '/', label: 'Dashboard' }] },
  {
    groupLabel: 'Konten',
    items: [
      { to: '/blog-posts', label: 'Blog Posts' },
      { to: '/tags', label: 'Tags' },
      { to: '/post-tags', label: 'Post Tags' },
    ],
  },
  {
    groupLabel: 'Portfolio',
    items: [
      { to: '/users', label: 'Users' },
      { to: '/experiences', label: 'Experiences' },
      { to: '/educations', label: 'Educations' },
      { to: '/projects', label: 'Projects' },
      { to: '/certifications', label: 'Certifications' },
    ],
  },
  {
    groupLabel: 'Skills',
    items: [
      { to: '/skill-categories', label: 'Skill Categories' },
      { to: '/skills', label: 'Skills' },
      { to: '/user-skills', label: 'User Skills' },
      { to: '/project-skills', label: 'Project Skills' },
    ],
  },
  {
    groupLabel: 'Lainnya',
    items: [{ to: '/contact-messages', label: 'Contact Messages' }],
  },
];

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setThemeState] = useState('dark')
  const [openGroups, setOpenGroups] = useState({})

  const toggleGroup = (gIdx) => {
    setOpenGroups((prev) => ({ ...prev, [gIdx]: !prev[gIdx] }))
  }

  const isGroupOpen = (gIdx) => {
    const group = menuGroups[gIdx]
    const hasActiveItem = group.items.some(({ to }) => location.pathname === to)
    if (hasActiveItem) return true
    return openGroups[gIdx] ?? false
  }

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const closeSidebar = () => setSidebarOpen(false)

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  const handleLogout = () => {
    clearToken()
    closeSidebar()
    navigate('/login')
  }

  return (
    <div className="admin-wrapper" style={styles.wrapper}>
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}
        style={styles.sidebar}
      >
        <div style={styles.logo}>Portfolio Admin</div>
        <nav style={styles.nav} className="admin-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} style={styles.menuGroup}>
              <button
                type="button"
                onClick={() => toggleGroup(gIdx)}
                style={styles.groupButton}
                className="admin-nav-group-btn"
                aria-expanded={isGroupOpen(gIdx)}
              >
                <span>{group.groupLabel}</span>
                <span style={{ ...styles.chevron, transform: isGroupOpen(gIdx) ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {isGroupOpen(gIdx) && (
                <div style={styles.dropdownItems}>
                  {group.items.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={closeSidebar}
                      className={location.pathname === to ? 'admin-nav-link admin-nav-link--active' : 'admin-nav-link'}
                      style={styles.navLink}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer" style={styles.sidebarFooter}>
          <button
            type="button"
            className="admin-theme-toggle"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
            title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button type="button" style={styles.logout} onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <div style={styles.main} className="admin-main">
        <header style={styles.header} className="admin-header">
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="admin-hamburger-bar" />
            <span className="admin-hamburger-bar" />
            <span className="admin-hamburger-bar" />
          </button>
          <h1 style={styles.headerTitle}>Admin</h1>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 'var(--sidebar-width)',
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
  },
  logo: { padding: '0 1rem 1rem', fontWeight: 700, fontSize: '1rem' },
  nav: { flex: 1, overflow: 'auto' },
  menuGroup: { marginBottom: '0.25rem' },
  groupLabel: {
    padding: '0.25rem 1rem',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
  },
  groupButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.5rem 1rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: 'var(--color-text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    font: 'inherit',
  },
  chevron: {
    fontSize: '0.625rem',
    opacity: 0.8,
    transition: 'transform 0.2s ease',
  },
  dropdownItems: { paddingLeft: '0.25rem' },
  navLink: {
    display: 'block',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
  sidebarFooter: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '0.5rem',
  },
  logout: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  headerTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 600 },
  content: { padding: '1.5rem', flex: 1 },
};
