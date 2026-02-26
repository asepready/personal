import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getList } from '../api'

// Base URL for blog post preview (set VITE_SITE_URL in .env for production)
const BLOG_PREVIEW_BASE = import.meta.env.VITE_SITE_URL || ''

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [blogDraft, setBlogDraft] = useState(0)
  const [blogPublished, setBlogPublished] = useState(0)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const resources = ['users', 'projects', 'blog-posts', 'contact-messages']
        const out = {}
        for (const r of resources) {
          const res = await getList(r, { per_page: 1 })
          const data = res?.data ?? res
          out[r] = data?.total ?? (Array.isArray(data?.data) ? data.data.length : 0)
        }
        if (!cancelled) setCounts(out)

        // Blog breakdown: API supports is_published filter
        const [pubRes, draftRes] = await Promise.all([
          getList('blog-posts', { per_page: 1, is_published: 1 }),
          getList('blog-posts', { per_page: 1, is_published: 0 }),
        ])
        const pubData = pubRes?.data ?? pubRes
        const draftData = draftRes?.data ?? draftRes
        if (!cancelled) {
          setBlogPublished(pubData?.total ?? 0)
          setBlogDraft(draftData?.total ?? 0)
        }

        // Recent posts: API orders by id asc; last page = newest. Fetch last 5, show newest first.
        const total = out['blog-posts'] ?? 0
        if (total > 0) {
          const lastPage = Math.ceil(total / 5)
          const recentRes = await getList('blog-posts', { per_page: 5, page: lastPage })
          const recentData = recentRes?.data ?? recentRes
          const list = Array.isArray(recentData?.data) ? recentData.data : []
          if (!cancelled) setRecentPosts([...list].reverse())
        }
      } catch (_) {}
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) return <p>Memuat...</p>

  const cards = [
    { label: 'Users', value: counts.users ?? 0, to: '/users' },
    { label: 'Projects', value: counts.projects ?? 0, to: '/projects' },
    { label: 'Blog Posts', value: counts['blog-posts'] ?? 0, to: '/blog-posts' },
    { label: 'Contact Messages', value: counts['contact-messages'] ?? 0, to: '/contact-messages' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>
      <div style={styles.grid}>
        {cards.map(({ label, value, to }) => (
          <Link key={to} to={to} style={styles.card}>
            <span style={styles.value}>{value}</span>
            <span style={styles.label}>{label}</span>
          </Link>
        ))}
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={styles.sectionTitle}>Blog</h3>
        <div style={styles.blogStats}>
          <span style={styles.blogStatItem}>
            <strong>{counts['blog-posts'] ?? 0}</strong> total
          </span>
          <span style={styles.blogStatItem}>
            <strong>{blogDraft}</strong> draft
          </span>
          <span style={styles.blogStatItem}>
            <strong>{blogPublished}</strong> published
          </span>
        </div>
        <Link to="/blog-posts" style={styles.link}>Kelola Blog Posts</Link>
      </section>

      {recentPosts.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h3 style={styles.sectionTitle}>Post terbaru</h3>
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
        </section>
      )}
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: '1.25rem',
    color: 'inherit',
  },
  value: { display: 'block', fontSize: '1.75rem', fontWeight: 700 },
  label: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  sectionTitle: { margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 },
  blogStats: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' },
  blogStatItem: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  link: { fontSize: '0.875rem', color: 'var(--color-primary, #0ea5e9)' },
  recentList: { listStyle: 'none', margin: 0, padding: 0 },
  recentItem: { padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' },
  recentTitle: { fontWeight: 500 },
  recentMeta: { fontSize: '0.8125rem', color: 'var(--color-text-muted)' },
}
