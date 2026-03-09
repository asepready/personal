import { useState, useEffect } from 'react'
import { getUsers, getEducations } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import Timeline from '../components/ui/Timeline'

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
  const timelineItems = (items || []).map((e) => ({
    id: e.id,
    title: e.degree,
    subtitle: e.institution_name,
    period: `${formatDate(e.start_date)} – ${e.is_current ? 'Sekarang' : formatDate(e.end_date)}`,
    location: e.location,
    description: [e.field_of_study, e.description].filter(Boolean).join(' — '),
  }))

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Pendidikan</h1>
      <Timeline items={timelineItems} />
      {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada data pendidikan.</p>}
    </div>
  )
}
