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

  const published = (items || []).filter((p) => p.is_published === true)
  const featured = published.filter((p) => p.is_featured)
  const others = published.filter((p) => !p.is_featured)

  const coverUrl = (p) => p.image_url || p.cover_image_url || p.thumbnail_url

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Proyek</h1>
      {featured.length > 0 && (
        <section style={styles.featuredSection}>
          <h2 style={styles.sectionSubtitle}>Proyek Unggulan</h2>
          <div style={styles.featuredGrid}>
            {featured.map((p) => (
              <div key={p.id} className="project-card-hover" style={styles.featuredCard}>
                <Link to={`/proyek/${p.id}`} style={styles.cardLink}>
                  {coverUrl(p) && (
                    <div className="project-img-wrap">
                      <img src={coverUrl(p)} alt="" loading="lazy" />
                    </div>
                  )}
                  <h3 style={styles.title}>{p.title}</h3>
                  <p style={styles.summary}>{p.summary || p.description || ''}</p>
                  {Array.isArray(p.skills) && p.skills.length > 0 && (
                    <div style={styles.tags}>
                      {p.skills.map((s) => (
                        <span key={s.id || s.name} style={styles.tag}>{s.name}</span>
                      ))}
                    </div>
                  )}
                </Link>
                <div style={styles.links}>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      Lihat Demo
                    </a>
                  )}
                  {p.repository_url && (
                    <a href={p.repository_url} target="_blank" rel="noopener noreferrer">
                      Repo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: featured.length ? '3rem' : 0 }}>
        <h2 style={styles.sectionSubtitle}>Proyek Lainnya</h2>
        <div style={styles.grid}>
          {others.map((p) => (
            <div key={p.id} className="project-card-hover" style={styles.card}>
              <Link to={`/proyek/${p.id}`} style={styles.cardLink}>
                {coverUrl(p) && (
                  <div className="project-img-wrap">
                    <img src={coverUrl(p)} alt="" loading="lazy" />
                  </div>
                )}
                <h3 style={styles.title}>{p.title}</h3>
                <p style={styles.summary}>{p.summary || p.description || ''}</p>
                {Array.isArray(p.skills) && p.skills.length > 0 && (
                  <div style={styles.tags}>
                    {p.skills.map((s) => (
                      <span key={s.id || s.name} style={styles.tag}>{s.name}</span>
                    ))}
                  </div>
                )}
              </Link>
              <div style={styles.links}>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    Demo
                  </a>
                )}
                {p.repository_url && (
                  <a href={p.repository_url} target="_blank" rel="noopener noreferrer">
                    Repo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {published.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada proyek.</p>}
      </section>
    </div>
  )
}

const styles = {
  featuredSection: {
    marginBottom: '2rem',
  },
  sectionSubtitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0 0 1rem',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '1.75rem',
  },
  featuredCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    padding: '1.75rem 1.75rem 1.5rem',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.45)',
  },
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
  cardLink: {
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
  },
  title: { margin: '0 0 0.5rem', fontSize: '1.25rem' },
  summary: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  tag: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.55rem',
    borderRadius: 9999,
    background: 'var(--color-border)',
  },
  links: {
    marginTop: '1rem',
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
  },
}
