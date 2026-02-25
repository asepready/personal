import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getList } from '../api'

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resources = ['users', 'projects', 'blog-posts', 'contact-messages'];
    let cancelled = false;
    (async () => {
      try {
        const out = {};
        for (const r of resources) {
          const res = await getList(r, { per_page: 1 });
          const data = res?.data ?? res;
          out[r] = data?.total ?? (Array.isArray(data?.data) ? data.data.length : 0);
        }
        if (!cancelled) setCounts(out);
      } catch (_) {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Memuat...</p>;

  const cards = [
    { label: 'Users', value: counts.users ?? 0, to: '/users' },
    { label: 'Projects', value: counts.projects ?? 0, to: '/projects' },
    { label: 'Blog Posts', value: counts['blog-posts'] ?? 0, to: '/blog-posts' },
    { label: 'Contact Messages', value: counts['contact-messages'] ?? 0, to: '/contact-messages' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>
      <div style={styles.grid}>
        {cards.map(({ label, value, to }) => (
          <Link key={to} to={to} style={styles.card}>
            <span style={styles.value}>{value}</span>
            <span style={styles.label}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: '1.25rem',
    color: 'inherit',
  },
  value: { display: 'block', fontSize: '1.75rem', fontWeight: 700 },
  label: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
};
