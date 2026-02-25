import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, getProjects } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function Projects() {
  const [items, setItems] = useState([])
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
        const res = await getProjects(first ? { user_id: first.id, per_page: 50 } : { per_page: 50 })
        if (cancelled) return
        setItems(res?.data?.data ?? res?.data ?? [])
      } catch (e) {
        if (!cancelled) setError(e.message || 'Gagal memuat data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [retryKey])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Proyek</h1>
      <div style={styles.grid}>
        {items.map((p) => (
          <Link key={p.id} to={`/proyek/${p.id}`} style={styles.card}>
            <h2 style={styles.title}>{p.title}</h2>
            {p.is_featured && <span style={styles.badge}>Unggulan</span>}
            <p style={styles.summary}>{p.summary || p.description || ''}</p>
            <div style={styles.links}>
              {p.url && <span>Demo</span>}
              {p.repository_url && <span>Repo</span>}
            </div>
          </Link>
        ))}
      </div>
      {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada proyek.</p>}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
    color: 'inherit',
    position: 'relative',
  },
  title: { margin: '0 0 0.5rem', fontSize: '1.25rem' },
  badge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '0.75rem',
    background: 'var(--color-primary)',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
  },
  summary: { margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  links: { marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-primary)' },
}
