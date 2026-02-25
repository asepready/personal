import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.links}>
          <Link to="/tentang">Tentang</Link>
          <Link to="/kontak">Kontak</Link>
        </div>
        <p style={styles.copyright}>© {year} Portfolio. All rights reserved.</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    marginTop: '3rem',
    padding: '1.5rem 0',
  },
  inner: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  copyright: {
    margin: 0,
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
  },
}
