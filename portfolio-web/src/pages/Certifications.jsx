import { useState, useEffect } from 'react'
import { getUsers, getCertifications } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function Certifications() {
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
        const res = await getCertifications(first ? { user_id: first.id, per_page: 50 } : { per_page: 50 })
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

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '')

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Sertifikasi</h1>
      <div style={styles.grid}>
        {items.map((c) => (
          <article key={c.id} style={styles.card}>
            <h2 style={styles.title}>{c.name}</h2>
            {c.issuer && <p style={styles.issuer}>{c.issuer}</p>}
            <p style={styles.date}>{formatDate(c.issue_date)}</p>
            {c.credential_url && (
              <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={styles.link}>
                Lihat kredensial
              </a>
            )}
            {c.description && <p style={styles.desc}>{c.description}</p>}
          </article>
        ))}
      </div>
      {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada sertifikasi.</p>}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
  },
  title: { margin: '0 0 0.25rem', fontSize: '1.125rem' },
  issuer: { margin: 0, fontWeight: 600, fontSize: '0.9375rem' },
  date: { margin: '0.25rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  link: { marginTop: '0.5rem' },
  desc: { margin: '0.75rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' },
}
