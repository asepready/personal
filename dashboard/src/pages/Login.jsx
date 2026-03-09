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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-[400px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
        <h1 className="text-center text-2xl font-semibold text-[var(--color-text)] mb-2">Portfolio Admin</h1>
        <p className="text-center text-sm text-[var(--color-text-muted)] mb-6">
          Masukkan username dan password untuk masuk.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              disabled={loading}
              className="w-full py-2.5 px-3.5 text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-60 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full py-2.5 px-3.5 text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-60 transition-shadow"
            />
          </div>
          {error && (
            <p className="text-sm text-[var(--color-danger)]" role="alert">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
