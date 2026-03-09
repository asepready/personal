import { Link } from 'react-router-dom'
import { useAdminSummary } from '../hooks/useAdminSummary'

// Base URL for blog post preview (set VITE_SITE_URL in .env for production)
const BLOG_PREVIEW_BASE = import.meta.env.VITE_SITE_URL || ''

export default function Dashboard() {
  const { counts, blogPublished, blogDraft, unreadMessages, recentPosts, loading } = useAdminSummary()

  const totalMessages = counts['contact-messages'] ?? 0
  const statCards = [
    { label: 'Total Projects', value: counts.projects ?? 0, sub: 'Proyek', to: '/projects' },
    { label: 'Published Posts', value: blogPublished, sub: `Draft: ${blogDraft}`, to: '/blog-posts' },
    { label: 'New Messages', value: totalMessages, sub: `Unread: ${unreadMessages}`, to: '/messages', highlight: unreadMessages > 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Ringkasan konten dan pesan</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner" aria-hidden="true" />
          <span className="sr-only">Memuat...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map(({ label, value, sub, to, highlight }) => (
              <Link
                key={to}
                to={to}
                className={`block rounded-[var(--radius-lg)] border p-5 transition-all hover:shadow-[var(--shadow-sm)] ${highlight ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-surface-elevated)]'}`}
              >
                <span className="block text-3xl font-bold text-[var(--color-text)]">{value}</span>
                <span className="block mt-1 text-[0.9375rem] font-semibold text-[var(--color-text)]">{label}</span>
                <span className="block mt-0.5 text-xs text-[var(--color-text-muted)]">{sub}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/blog-posts"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
            >
              + Tulis Blog Baru
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
            >
              + Tambah Project
            </Link>
          </div>

          <section className="mt-8">
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-3">Post terbaru</h2>
            {recentPosts.length > 0 ? (
              <ul className="list-none p-0 m-0 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                {recentPosts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-wrap justify-between items-center gap-2 py-3 px-4 border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <span className="font-medium text-[var(--color-text)]">{post.title ?? `Post #${post.id}`}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {post.is_published ? 'Published' : 'Draft'}
                      {' · '}
                      <Link to={`/blog-posts?edit=${post.id}`} className="text-[var(--color-primary)] hover:underline">Edit</Link>
                      {post.slug && BLOG_PREVIEW_BASE && (
                        <>
                          {' · '}
                          <a href={`${BLOG_PREVIEW_BASE.replace(/\/$/, '')}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                            Preview
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">Belum ada post.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
