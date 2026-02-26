import { useState, useEffect } from 'react'
import { getUsers, getExperiences, getEducations } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function About() {
  const [user, setUser] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const userRes = await getUsers({ per_page: 1 })
        if (cancelled) return
        const first = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        if (first) setUser(first)
        const params = first ? { user_id: first.id, per_page: 5 } : { per_page: 5 }
        const [expRes, eduRes] = await Promise.all([
          getExperiences(params),
          getEducations(params),
        ])
        if (cancelled) return
        setExperiences(expRes?.data?.data ?? expRes?.data ?? [])
        setEducations(eduRes?.data?.data ?? eduRes?.data ?? [])
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

  const u = user || {}
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : '')

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Tentang Saya</h1>
      <p style={styles.intro}>
        Berikut ringkasan profil, pengalaman kerja, dan pendidikan saya.
      </p>
      <div style={styles.profile}>
        {u.profile_image_url && (
          <img src={u.profile_image_url} alt="" style={styles.avatar} loading="lazy" />
        )}
        <div>
          <h2 style={styles.name}>{u.full_name}</h2>
          {u.headline && <p style={styles.headline}>{u.headline}</p>}
          {u.bio && <p style={styles.bio}>{u.bio}</p>}
          {u.location && <p style={styles.meta}>📍 {u.location}</p>}
          {u.email_public && (
            <p style={styles.meta}>
              <a href={`mailto:${u.email_public}`}>{u.email_public}</a>
            </p>
          )}
        </div>
      </div>

      {experiences.length > 0 && (
        <section style={styles.section}>
          <h2 className="section-title">Pengalaman Kerja</h2>
          <ul style={styles.timeline}>
            {experiences.map((e) => (
              <li key={e.id} style={styles.timelineItem}>
                <strong>{e.position_title}</strong> — {e.company_name}
                {e.location && ` · ${e.location}`}
                <span style={styles.date}>
                  {formatDate(e.start_date)} – {e.is_current ? 'Sekarang' : formatDate(e.end_date)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {educations.length > 0 && (
        <section style={styles.section}>
          <h2 className="section-title">Pendidikan</h2>
          <ul style={styles.timeline}>
            {educations.map((e) => (
              <li key={e.id} style={styles.timelineItem}>
                <strong>{e.degree}</strong> {e.field_of_study && `— ${e.field_of_study}`} · {e.institution_name}
                {e.location && ` · ${e.location}`}
                <span style={styles.date}>
                  {formatDate(e.start_date)} – {e.is_current ? 'Sekarang' : formatDate(e.end_date)}
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
  intro: { color: 'var(--color-text-muted)', marginBottom: '1.5rem', maxWidth: 560 },
  profile: { display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '2rem' },
  avatar: { width: 160, height: 160, borderRadius: 12, objectFit: 'cover' },
  name: { margin: '0 0 0.25rem', fontSize: '1.5rem' },
  headline: { color: 'var(--color-text-muted)', margin: '0 0 0.75rem' },
  bio: { margin: '0 0 0.5rem' },
  meta: { margin: '0.25rem 0', fontSize: '0.9375rem' },
  section: { marginTop: '2.5rem' },
  timeline: { listStyle: 'none', padding: 0, margin: 0 },
  timelineItem: { marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '3px solid var(--color-primary)' },
  date: { display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' },
}
