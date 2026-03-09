import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!id) return
      try {
        setError(null)
        const res = await getProject(id)
        if (cancelled) return
        setProject(res?.data ?? res)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Proyek tidak ditemukan.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, retryKey])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />
  if (!project) return null

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '')
  const skills = project.skills || []
  const coverUrl = project.image_url || project.cover_image_url || project.thumbnail_url

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Link to="/proyek" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Kembali ke Proyek</Link>
      <article style={styles.article}>
        <h1 style={styles.title}>{project.title}</h1>
        <div style={styles.meta}>
          {project.start_date && (
            <span>{formatDate(project.start_date)} – {project.end_date ? formatDate(project.end_date) : 'Sekarang'}</span>
          )}
        </div>
        {coverUrl && (
          <div className="project-img-wrap" style={styles.heroImage}>
            <img src={coverUrl} alt="" />
          </div>
        )}
        {project.summary && (
          <p style={styles.summary}>{project.summary}</p>
        )}
        {project.description && (
          <div style={styles.description}>{project.description}</div>
        )}
        {project.challenge && (
          <>
            <h2 style={styles.h2}>Tantangan</h2>
            <div style={styles.block}>{project.challenge}</div>
          </>
        )}
        {project.solution && (
          <>
            <h2 style={styles.h2}>Solusi</h2>
            <div style={styles.block}>{project.solution}</div>
          </>
        )}
        <div style={styles.links}>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Lihat Demo</a>
          )}
          {project.repository_url && (
            <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Repositori</a>
          )}
        </div>
        {skills.length > 0 && (
          <div style={styles.skills}>
            <strong>Teknologi:</strong>{' '}
            {skills.map((s) => s.name).join(', ')}
          </div>
        )}
      </article>
    </div>
  )
}

const styles = {
  article: { maxWidth: 720 },
  title: { margin: '0 0 0.5rem', fontSize: '1.75rem' },
  meta: { fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '1rem' },
  heroImage: { aspectRatio: '21/9', marginBottom: '1.5rem' },
  summary: { fontSize: '1.125rem', marginBottom: '1rem' },
  description: { marginBottom: '1.5rem', whiteSpace: 'pre-wrap' },
  h2: { margin: '1.5rem 0 0.5rem', fontSize: '1.25rem' },
  block: { marginBottom: '1rem', whiteSpace: 'pre-wrap' },
  links: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  skills: { marginTop: '1.5rem', fontSize: '0.9375rem' },
}
