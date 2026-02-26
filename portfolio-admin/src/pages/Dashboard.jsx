import { Link } from 'react-router-dom'
import { useAdminSummary } from '../hooks/useAdminSummary'

// Base URL for blog post preview (set VITE_SITE_URL in .env for production)
const BLOG_PREVIEW_BASE = import.meta.env.VITE_SITE_URL || ''

export default function Dashboard() {
  const { counts, blogPublished, blogDraft, unreadMessages, recentPosts, loading } = useAdminSummary()

  if (loading) return <p>Memuat...</p>

  const totalMessages = counts['contact-messages'] ?? 0
  const statCards = [
    { label: 'Total Projects', value: counts.projects ?? 0, sub: 'Proyek', to: '/projects' },
    { label: 'Published Posts', value: blogPublished, sub: `Draft: ${blogDraft}`, to: '/blog-posts' },
    { label: 'New Messages', value: totalMessages, sub: `Unread: ${unreadMessages}`, to: '/messages', highlight: unreadMessages > 0 },
  ]

  return (
    <div>
      <div style={styles.statsGrid}>
        {statCards.map(({ label, value, sub, to, highlight }) => (
          <Link key={to} to={to} style={{ ...styles.statCard, ...(highlight ? styles.statCardHighlight : {}) }}>
            <span style={styles.statValue}>{value}</span>
            <span style={styles.statLabel}>{label}</span>
            <span style={styles.statSub}>{sub}</span>
          </Link>
        ))}
      </div>

      <div style={styles.quickActions}>
        <Link to="/blog-posts" style={styles.quickActionBtn}>+ Tulis Blog Baru</Link>
        <Link to="/projects" style={styles.quickActionBtn}>+ Tambah Project</Link>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={styles.sectionTitle}>Post terbaru</h3>
        {recentPosts.length > 0 ? (
          <ul style={styles.recentList}>
            {recentPosts.map((post) => (
              <li key={post.id} style={styles.recentItem}>
                <span style={styles.recentTitle}>{post.title ?? `Post #${post.id}`}</span>
                <span style={styles.recentMeta}>
                  {post.is_published ? 'Published' : 'Draft'}
                  {' · '}
                  <Link to={`/blog-posts?edit=${post.id}`} style={styles.link}>Edit</Link>
                  {post.slug && BLOG_PREVIEW_BASE && (
                    <>
                      {' · '}
                      <a href={`${BLOG_PREVIEW_BASE.replace(/\/$/, '')}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        Preview
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Belum ada post.</p>
        )}
      </section>
    </div>
  )
}

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' },
  statCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
    color: 'inherit',
  },
  statCardHighlight: { borderColor: 'var(--color-primary)', background: 'rgba(79, 70, 229, 0.08)' },
  statValue: { display: 'block', fontSize: '2rem', fontWeight: 700 },
  statLabel: { display: 'block', fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem' },
  statSub: { display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' },
  quickActions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' },
  quickActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    borderRadius: 8,
    background: 'var(--color-primary)',
    color: 'white',
  },
  sectionTitle: { margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 },
  link: { fontSize: '0.875rem', color: 'var(--color-primary)' },
  recentList: { listStyle: 'none', margin: 0, padding: 0 },
  recentItem: { padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' },
  recentTitle: { fontWeight: 500 },
  recentMeta: { fontSize: '0.8125rem', color: 'var(--color-text-muted)' },
}
