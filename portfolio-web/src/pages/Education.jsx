import { useState, useEffect } from 'react'
import { getUsers, getEducations } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function Education() {
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
        const eduRes = await getEducations(first ? { user_id: first.id, per_page: 50 } : { per_page: 50 })
        if (cancelled) return
        setItems(eduRes?.data?.data ?? eduRes?.data ?? [])
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
      <h1 className="section-title">Pendidikan</h1>
      <div style={styles.timeline}>
        {items.map((e) => (
          <article key={e.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.title}>{e.degree}</h2>
              <span style={styles.date}>
                {formatDate(e.start_date)} – {e.is_current ? 'Sekarang' : formatDate(e.end_date)}
              </span>
            </div>
            <p style={styles.institution}>{e.institution_name}</p>
            {e.field_of_study && <p style={styles.field}>{e.field_of_study}</p>}
            {e.location && <p style={styles.location}>{e.location}</p>}
            {e.description && <p style={styles.desc}>{e.description}</p>}
          </article>
        ))}
      </div>
      {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada data pendidikan.</p>}
    </div>
  )
}

const styles = {
  timeline: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
  },
  cardHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' },
  title: { margin: 0, fontSize: '1.25rem' },
  date: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  institution: { margin: '0.5rem 0 0', fontWeight: 600 },
  field: { margin: '0.25rem 0', fontSize: '0.9375rem' },
  location: { margin: '0.25rem 0', fontSize: '0.9375rem', color: 'var(--color-text-muted)' },
  desc: { margin: '0.75rem 0 0', fontSize: '0.9375rem' },
}
