import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, getProjects } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function Home() {
  const [user, setUser] = useState(null)
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const [userRes, projectsRes] = await Promise.all([
          getUsers({ per_page: 1 }),
          getProjects({ per_page: 3 }),
        ])
        if (cancelled) return
        const firstUser = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        if (firstUser) setUser(firstUser)
        const list = projectsRes?.data?.data ?? projectsRes?.data ?? []
        setFeatured(Array.isArray(list) ? list.filter((p) => p.is_featured).slice(0, 3) : [])
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
      <section className="home-hero">
        <div className="home-hero-left">
          <p className="fade-in-up" style={styles.kicker}>Hi, I&apos;m</p>
          <h1 className="fade-in-up delay-1" style={styles.heroTitle}>
            {user?.full_name || 'Portfolio'}
          </h1>
          <p className="fade-in-up delay-2" style={styles.heroHeadline}>
            {user?.headline || 'Membangun solusi web yang skalabel dengan React & PHP.'}
          </p>
          {user?.bio && (
            <p className="fade-in-up delay-3" style={styles.heroBody}>
              {user.bio}
            </p>
          )}
          <div className="fade-in-up delay-3" style={styles.cta}>
            <Link to="/proyek" className="btn btn-primary">Lihat Portofolio</Link>
            <Link to="/kontak" className="btn btn-outline">Hubungi Saya</Link>
          </div>
        </div>
        <div className="home-hero-right">
          {user?.profile_image_url && (
            <div className="home-hero-photo-wrapper fade-in-up delay-2">
              <div className="home-hero-blob" aria-hidden="true" />
              <img
                src={user.profile_image_url}
                alt={user.full_name || 'Foto profil'}
                loading="lazy"
                className="home-hero-avatar"
              />
            </div>
          )}
        </div>
      </section>

      {user?.bio && (
        <section style={styles.section}>
          <h2 className="section-title">Tentang Saya</h2>
          <p style={styles.bio}>{user.bio}</p>
          <Link to="/tentang">Baca lebih lengkap →</Link>
        </section>
      )}

      {featured.length > 0 && (
        <section style={styles.section}>
          <h2 className="section-title">Proyek Unggulan</h2>
          <div style={styles.projectGrid}>
            {featured.map((p) => (
              <Link key={p.id} to={`/proyek/${p.id}`} style={styles.projectCard}>
                <h3 style={styles.projectTitle}>{p.title}</h3>
                <p style={styles.projectSummary}>{p.summary || ''}</p>
              </Link>
            ))}
          </div>
          <Link to="/proyek" style={{ marginTop: '1rem', display: 'inline-block' }}>Lihat semua proyek →</Link>
        </section>
      )}
    </div>
  )
}

const styles = {
  kicker: { margin: 0, fontSize: '0.9375rem', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
  heroTitle: { fontSize: '2.5rem', fontWeight: 700, margin: '0.35rem 0 0.5rem' },
  heroHeadline: { fontSize: '1.125rem', color: 'var(--color-text-muted)', margin: '0 0 0.75rem' },
  heroBody: { margin: '0 0 1.5rem', maxWidth: 520 },
  cta: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  section: { marginTop: '3rem' },
  bio: { color: 'var(--color-text-muted)', marginBottom: '0.5rem' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' },
  projectCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.25rem',
    color: 'inherit',
  },
  projectTitle: { margin: '0 0 0.5rem', fontSize: '1.125rem' },
  projectSummary: { margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' },
}
