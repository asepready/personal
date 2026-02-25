import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, getBlogPosts } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

const PER_PAGE = 10

export default function Blog() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const userRes = await getUsers({ per_page: 1 })
        const first = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        const res = await getBlogPosts(
          first ? { user_id: first.id, per_page: PER_PAGE, page } : { per_page: PER_PAGE, page }
        )
        if (cancelled) return
        const data = res?.data ?? res
        setItems(data?.data ?? data ?? [])
        setTotal(data?.total ?? (data?.data ?? []).length)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Gagal memuat data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, retryKey])

  if (loading && items.length === 0) return <Loading />
  if (error && items.length === 0) return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '')
  const totalPages = Math.ceil(total / PER_PAGE) || 1

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Blog</h1>
      <div style={styles.list}>
        {items.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} style={styles.card}>
            <h2 style={styles.title}>{post.title}</h2>
            <time style={styles.date}>{formatDate(post.published_at)}</time>
            {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
            {post.tags?.length > 0 && (
              <div style={styles.tags}>
                {post.tags.map((t) => (
                  <span key={t.id} style={styles.tag}>{t.name}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
      {items.length === 0 && !loading && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada post.</p>}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </button>
          <span style={styles.pageInfo}>Halaman {page} dari {totalPages}</span>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
    color: 'inherit',
  },
  title: { margin: '0 0 0.25rem', fontSize: '1.25rem' },
  date: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  excerpt: { margin: '0.75rem 0 0', fontSize: '0.9375rem', color: 'var(--color-text-muted)' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' },
  tag: { fontSize: '0.75rem', background: 'var(--color-border)', padding: '0.2rem 0.5rem', borderRadius: 4 },
  pagination: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' },
  pageInfo: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
}
