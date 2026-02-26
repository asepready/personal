import { useState, useEffect } from 'react'
import { getUsers, postContactMessage } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

const DEFAULT_USER_ID = 1

export default function Contact() {
  const [userId, setUserId] = useState(DEFAULT_USER_ID)
  const [loadingUser, setLoadingUser] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', user_id: DEFAULT_USER_ID })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const userRes = await getUsers({ per_page: 1 })
        const first = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        if (cancelled) return
        if (first?.id) setForm((f) => ({ ...f, user_id: first.id }))
      } catch (_) {}
      finally {
        if (!cancelled) setLoadingUser(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setFormErrors((e) => ({ ...e, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    setError(null)
    setSubmitLoading(true)
    try {
      await postContactMessage(form)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '', user_id: form.user_id })
    } catch (err) {
      if (err.errors) setFormErrors(err.errors)
      setError(err.message || 'Gagal mengirim pesan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loadingUser) return <Loading />

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 560 }}>
      <h1 className="section-title">Kontak</h1>
      {success && (
        <div className="contact-success-box" role="status">
          Pesan berhasil dikirim. Terima kasih!
        </div>
      )}
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="user_id" value={form.user_id} />
        <div style={styles.field}>
          <label htmlFor="name">Nama *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
          {formErrors.name && <span className="form-error" style={styles.err}>{formErrors.name[0]}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          {formErrors.email && <span className="form-error" style={styles.err}>{formErrors.email[0]}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="subject">Subjek *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={handleChange}
            style={styles.input}
          />
          {formErrors.subject && <span className="form-error" style={styles.err}>{formErrors.subject[0]}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="message">Pesan *</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: 120 }}
          />
          {formErrors.message && <span className="form-error" style={styles.err}>{formErrors.message[0]}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
          {submitLoading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  field: { marginBottom: '1.25rem' },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.625rem 0.875rem',
    fontSize: '1rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text)',
  },
  err: { marginTop: '0.25rem', display: 'block' },
}
