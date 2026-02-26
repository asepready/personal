import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { clearToken, getCurrentUser } from '../auth'
import { getTheme, setTheme } from '../theme'
import { getList } from '../api'

const SIDEBAR_COLLAPSED_KEY = 'portfolio_admin_sidebar_collapsed'

const menuGroups = [
  { groupLabel: 'Utama', icon: 'D', items: [{ to: '/', label: 'Dashboard' }] },
  {
    groupLabel: 'Konten',
    icon: 'K',
    items: [
      { to: '/blog-posts', label: 'Blog Posts' },
      { to: '/tags', label: 'Tags' },
      { to: '/messages', label: 'Messages' },
    ],
  },
  {
    groupLabel: 'Portfolio',
    icon: 'P',
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
    icon: 'S',
    items: [
      { to: '/skill-categories', label: 'Skill Categories' },
      { to: '/skills', label: 'Skills' },
      { to: '/user-skills', label: 'User Skills' },
      { to: '/project-skills', label: 'Project Skills' },
    ],
  },
  {
    groupLabel: 'Lainnya',
    icon: 'L',
    items: [{ to: '/contact-messages', label: 'Contact Messages' }],
  },
]

function getBreadcrumbs(pathname) {
  if (pathname === '/') return [{ label: 'Dashboard' }]
  const segments = pathname.slice(1).split('/')
  const map = {
    'blog-posts': 'Blog Posts',
    'contact-messages': 'Pesan Kontak',
    'skill-categories': 'Kategori Skill',
    'user-skills': 'User Skills',
    'project-skills': 'Project Skills',
    'post-tags': 'Post Tags',
    projects: 'Projects',
    users: 'Users',
    experiences: 'Pengalaman',
    educations: 'Pendidikan',
    certifications: 'Sertifikasi',
    skills: 'Skills',
    tags: 'Tags',
    messages: 'Messages',
  }
  const out = [{ label: 'Dashboard', to: '/' }]
  let acc = ''
  for (const seg of segments) {
    acc += (acc ? '/' : '') + seg
    const label = map[seg] || seg
    out.push({ label, to: acc })
  }
  return out
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1' } catch { return false }
  })
  const [theme, setThemeState] = useState('dark')
  const [openGroups, setOpenGroups] = useState({})
  const [unreadCount, setUnreadCount] = useState(0)

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

  useEffect(() => {
    let cancelled = false
    getList('contact-messages', { is_read: 0, per_page: 1 })
      .then((res) => {
        if (cancelled) return
        const data = res?.data ?? res
        setUnreadCount(data?.total ?? 0)
      })
      .catch(() => { if (!cancelled) setUnreadCount(0) })
    return () => { cancelled = true }
  }, [location.pathname])

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((c) => {
      const next = !c
      try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0') } catch (_) {}
      return next
    })
  }

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

  const user = getCurrentUser()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <div className="admin-wrapper" style={styles.wrapper}>
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''} ${sidebarCollapsed ? 'admin-sidebar--collapsed' : ''}`}
        style={styles.sidebar}
      >
        <div style={styles.logo} className="admin-sidebar-label admin-logo-long">Portfolio Admin</div>
        <div style={styles.logo} className="admin-logo-icon" aria-hidden="true">P</div>
        <nav style={styles.nav} className="admin-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} style={styles.menuGroup}>
              <button
                type="button"
                onClick={() => toggleGroup(gIdx)}
                style={styles.groupButton}
                className="admin-nav-group-btn"
                aria-expanded={isGroupOpen(gIdx)}
                title={group.groupLabel}
              >
                <span className="admin-sidebar-label">{group.groupLabel}</span>
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
                      title={label}
                    >
                      <span className="admin-nav-link-text">{label}</span>
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
          <button type="button" style={styles.collapseBtn} onClick={toggleSidebarCollapsed} title={sidebarCollapsed ? 'Perlebar sidebar' : 'Sempitkan sidebar'}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </aside>
      <div style={styles.main} className="admin-main">
        <header style={styles.header} className="admin-header">
          <div style={styles.headerLeft}>
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
            <div>
              <input
                type="search"
                placeholder="Cari project / blog..."
                style={styles.searchInput}
                aria-label="Pencarian global"
              />
              <nav className="admin-breadcrumb" aria-label="Breadcrumb">
                {breadcrumbs.map((b, i) => (
                  <span key={i}>
                    {i > 0 && <span className="admin-breadcrumb-sep"> / </span>}
                    {b.to != null ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
                  </span>
                ))}
              </nav>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button
              type="button"
              className="admin-theme-toggle admin-theme-toggle--header"
              onClick={handleToggleTheme}
              aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
              title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
              style={styles.iconBtn}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/messages" className="admin-notif-wrap" title="Pesan masuk" style={styles.iconBtn}>
              🔔
              {unreadCount > 0 && <span className="admin-notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-border)]">
                {user?.full_name || 'Admin'} ▼
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="mt-1 min-w-[140px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg outline-none"
              >
                <MenuItem>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-text)] data-[focus]:bg-[var(--color-border)]"
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
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
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  searchInput: {
    width: '100%',
    maxWidth: 260,
    padding: '0.4rem 0.75rem',
    fontSize: '0.875rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 6,
    color: 'var(--color-text)',
  },
  iconBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, color: 'inherit' },
  profileBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.875rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 6,
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  dropdownBackdrop: { position: 'fixed', inset: 0, zIndex: 40 },
  profileDropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: 4,
    minWidth: 140,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    zIndex: 50,
    padding: '0.25rem 0',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  collapseBtn: {
    display: 'block',
    width: '100%',
    padding: '0.35rem 1rem',
    fontSize: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--color-text-muted)',
    font: 'inherit',
  },
  content: { padding: '1.5rem', flex: 1 },
};
