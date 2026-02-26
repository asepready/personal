import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.left}>
          <h2 style={styles.heading}>Let&apos;s Work Together!</h2>
          <p style={styles.text}>Punya ide proyek atau ingin berdiskusi?</p>
          <Link to="/kontak" className="btn btn-outline">Kirim Pesan</Link>
        </div>
        <div style={styles.right}>
          <div style={styles.socialRow}>
            <span style={styles.socialLabel}>Hubungi saya di:</span>
            <div style={styles.socialLinks}>
              <a href="#" aria-label="LinkedIn" style={styles.socialLink}>LinkedIn</a>
              <a href="#" aria-label="GitHub" style={styles.socialLink}>GitHub</a>
              <Link to="/kontak" style={styles.socialLink}>Email</Link>
            </div>
          </div>
          <p style={styles.copy}>© {year} Portfolio. Built with React &amp; Lumen.</p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#0f172a',
    borderTop: '1px solid var(--color-border)',
    marginTop: '3rem',
    padding: '2.5rem 0',
  },
  inner: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  left: {
    flex: '1 1 260px',
  },
  right: {
    flex: '1 1 260px',
    textAlign: 'right',
  },
  heading: {
    margin: '0 0 0.25rem',
    fontSize: '1.25rem',
    color: 'var(--color-text)',
  },
  text: {
    margin: '0 0 1rem',
    fontSize: '0.9375rem',
    color: 'var(--color-text-muted)',
  },
  socialRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  socialLabel: {
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  socialLink: {
    fontSize: '0.875rem',
    color: 'var(--color-text)',
  },
  copy: {
    margin: 0,
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
  },
}
