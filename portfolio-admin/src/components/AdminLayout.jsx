import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

const menu = [
  { to: '/', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/educations', label: 'Educations' },
  { to: '/skill-categories', label: 'Skill Categories' },
  { to: '/skills', label: 'Skills' },
  { to: '/user-skills', label: 'User Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/project-skills', label: 'Project Skills' },
  { to: '/blog-posts', label: 'Blog Posts' },
  { to: '/tags', label: 'Tags' },
  { to: '/post-tags', label: 'Post Tags' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/contact-messages', label: 'Contact Messages' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

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
        <nav style={styles.nav}>
          {menu.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeSidebar}
              style={{
                ...styles.navLink,
                ...(location.pathname === to ? styles.navLinkActive : {}),
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link to="/login" style={styles.logout} onClick={closeSidebar}>Logout</Link>
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
  navLink: {
    display: 'block',
    padding: '0.5rem 1rem',
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
  },
  navLinkActive: { color: 'var(--color-primary)', fontWeight: 500 },
  logout: { padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  headerTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 600 },
  content: { padding: '1.5rem', flex: 1 },
};
