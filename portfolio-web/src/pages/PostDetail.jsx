import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogPost } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import MarkdownContent from '../components/MarkdownContent'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!id) return
      try {
        setError(null)
        const res = await getBlogPost(id)
        if (cancelled) return
        setPost(res?.data ?? res)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Post tidak ditemukan.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, retryKey])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />
  if (!post) return null

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '')
  const tags = post.tags || []
  const readingTime = estimateReadingTime(post.content || '')

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Link to="/blog" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Kembali ke Blog</Link>
      <article style={styles.article}>
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.metaRow}>
          <time style={styles.date}>{formatDate(post.published_at)}</time>
          {readingTime && (
            <span style={styles.readingTime}>• {readingTime} min read</span>
          )}
        </div>
        {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
        <MarkdownContent content={post.content || ''} style={styles.content} />
        {tags.length > 0 && (
          <div style={styles.tags}>
            {tags.map((t) => (
              <span key={t.id} style={styles.tag}>{t.name}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

const styles = {
  article: { maxWidth: 720, margin: '0 auto' },
  title: { margin: '0 0 0.5rem', fontSize: '1.75rem' },
  metaRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  date: { fontSize: '0.9375rem', color: 'var(--color-text-muted)' },
  readingTime: { fontSize: '0.9375rem', color: 'var(--color-text-muted)' },
  excerpt: { fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' },
  content: { lineHeight: 1.7 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' },
  tag: { fontSize: '0.875rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.25rem 0.75rem', borderRadius: 6 },
}

function estimateReadingTime(content) {
  if (!content) return null
  const words = content.trim().split(/\s+/).length
  if (!words) return null
  const minutes = Math.max(1, Math.round(words / 200))
  return minutes
}

