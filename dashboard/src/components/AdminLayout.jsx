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
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={`admin-sidebar flex flex-col shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 ${sidebarOpen ? 'admin-sidebar--open' : ''} ${sidebarCollapsed ? 'admin-sidebar--collapsed' : ''}`}
        style={{ width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)', minWidth: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        <div className="admin-sidebar-label admin-logo-long px-4 pb-4 font-bold text-base text-[var(--color-text)]">Portfolio Admin</div>
        <div className="admin-logo-icon hidden text-center font-bold text-xl py-2 text-[var(--color-text)]" aria-hidden="true">P</div>
        <nav className="flex-1 overflow-auto px-0 admin-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-1">
              <button
                type="button"
                onClick={() => toggleGroup(gIdx)}
                className="admin-nav-group-btn flex w-full items-center justify-between px-4 py-2.5 text-[0.8125rem] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer"
                aria-expanded={isGroupOpen(gIdx)}
                title={group.groupLabel}
              >
                <span className="admin-sidebar-label">{group.groupLabel}</span>
                <span className="text-[0.625rem] opacity-80 transition-transform duration-200" style={{ transform: isGroupOpen(gIdx) ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {isGroupOpen(gIdx) && (
                <div className="pl-2">
                  {group.items.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={closeSidebar}
                      className={`admin-nav-link block py-2.5 px-4 text-sm rounded-r-md ${location.pathname === to ? 'admin-nav-link--active' : ''}`}
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
        <div className="admin-sidebar-footer border-t border-[var(--color-border)] pt-3 mt-auto px-2">
          <button
            type="button"
            className="admin-theme-toggle w-full"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
            title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 text-left text-xs text-[var(--color-text-muted)] bg-transparent border-none cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] transition-colors"
            onClick={toggleSidebarCollapsed}
            title={sidebarCollapsed ? 'Perlebar sidebar' : 'Sempitkan sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 h-14 flex items-center justify-between gap-4 flex-wrap px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              className="admin-hamburger shrink-0"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className="admin-hamburger-bar" />
              <span className="admin-hamburger-bar" />
              <span className="admin-hamburger-bar" />
            </button>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1 max-w-md">
              <input
                type="search"
                placeholder="Cari project / blog..."
                className="w-full max-w-[260px] py-2 px-3 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                aria-label="Pencarian global"
              />
              <nav className="admin-breadcrumb flex items-center gap-1 text-xs text-[var(--color-text-muted)]" aria-label="Breadcrumb">
                {breadcrumbs.map((b, i) => (
                  <span key={i}>
                    {i > 0 && <span className="opacity-60"> / </span>}
                    {b.to != null ? <Link to={b.to} className="hover:text-[var(--color-primary)] transition-colors">{b.label}</Link> : <span className="font-medium text-[var(--color-text)]">{b.label}</span>}
                  </span>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="admin-theme-toggle admin-theme-toggle--header inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)]"
              onClick={handleToggleTheme}
              aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}
              title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              to="/messages"
              className="admin-notif-wrap inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              title="Pesan masuk"
            >
              🔔
              {unreadCount > 0 && <span className="admin-notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                {user?.full_name || 'Admin'} ▼
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="mt-1.5 min-w-[160px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-md)] outline-none"
              >
                <MenuItem>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-elevated)] data-[focus]:bg-[var(--color-surface-elevated)]"
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

