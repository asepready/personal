import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Portfolio Admin</h1>
        <p style={styles.placeholder}>
          Login akan tersedia setelah API mendukung autentikasi. Untuk sementara Anda dapat mengakses dashboard tanpa login.
        </p>
        <Link to="/" className="btn btn-primary">Masuk ke Dashboard</Link>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '2rem',
    maxWidth: 400,
    textAlign: 'center',
  },
  title: { margin: '0 0 1rem', fontSize: '1.5rem' },
  placeholder: { color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' },
};
