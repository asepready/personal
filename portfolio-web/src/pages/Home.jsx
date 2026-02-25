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
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          {user?.profile_image_url && (
            <img
              src={user.profile_image_url}
              alt=""
              style={styles.avatar}
            />
          )}
          <h1 style={styles.heroTitle}>{user?.full_name || 'Portfolio'}</h1>
          <p style={styles.heroHeadline}>{user?.headline || 'Selamat datang di portfolio saya.'}</p>
          <div style={styles.cta}>
            <Link to="/proyek" className="btn btn-primary">Lihat Proyek</Link>
            <Link to="/kontak" className="btn btn-outline">Hubungi Saya</Link>
          </div>
        </div>
      </section>

      {user?.bio && (
        <section style={styles.section}>
          <h2 className="section-title">Tentang</h2>
          <p style={styles.bio}>{user.bio}</p>
          <Link to="/tentang">Selengkapnya →</Link>
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
          <Link to="/proyek" style={{ marginTop: '1rem', display: 'inline-block' }}>Semua proyek →</Link>
        </section>
      )}
    </div>
  )
}

const styles = {
  hero: { textAlign: 'center', padding: '2rem 0' },
  heroContent: { maxWidth: 600, margin: '0 auto' },
  avatar: { width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' },
  heroTitle: { fontSize: '2.25rem', fontWeight: 700, margin: '0 0 0.5rem' },
  heroHeadline: { fontSize: '1.125rem', color: 'var(--color-text-muted)', margin: '0 0 1.5rem' },
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
