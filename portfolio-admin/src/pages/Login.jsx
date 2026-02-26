import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, setToken, setCurrentUser } from '../auth'
import { login as apiLogin } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (getToken()) navigate('/', { replace: true })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const u = username.trim()
    const p = password
    if (!u || !p) {
      setError('Username dan password wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const res = await apiLogin(u, p)
      const token = res?.data?.token
      const user = res?.data?.user
      if (token) {
        setToken(token)
        if (user) setCurrentUser(user)
        navigate('/', { replace: true })
      } else {
        setError('Respons login tidak valid.')
      }
    } catch (err) {
      setError(err.message || 'Username atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Portfolio Admin</h1>
        <p style={styles.placeholder}>
          Masukkan username dan password untuk masuk.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              style={styles.input}
              disabled={loading}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
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
    width: '100%',
  },
  title: { margin: '0 0 1rem', fontSize: '1.5rem', textAlign: 'center' },
  placeholder: { color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '1.25rem', textAlign: 'center' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem' },
  input: {
    width: '100%',
    padding: '0.625rem 0.875rem',
    fontSize: '1rem',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text)',
    boxSizing: 'border-box',
  },
  error: { color: 'var(--color-danger)', fontSize: '0.875rem', margin: '0 0 1rem' },
  btn: { width: '100%' },
}
