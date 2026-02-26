import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getUsers, postContactMessage } from '../api'
import Loading from '../components/Loading'

const DEFAULT_USER_ID = 1

const contactSchema = z.object({
  user_id: z.number().optional(),
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(1, 'Subjek wajib diisi'),
  message: z.string().min(1, 'Pesan wajib diisi'),
})

export default function Contact() {
  const [userId, setUserId] = useState(DEFAULT_USER_ID)
  const [loadingUser, setLoadingUser] = useState(true)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: DEFAULT_USER_ID,
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const userRes = await getUsers({ per_page: 1 })
        const first = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        if (cancelled) return
        if (first?.id) {
          setUserId(first.id)
          setValue('user_id', first.id)
        }
      } catch (_) {
        // ignore, fallback to default user id
      } finally {
        if (!cancelled) setLoadingUser(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const onSubmit = async (data) => {
    setSubmitError(null)
    setSuccess(false)
    try {
      await postContactMessage({ ...data, user_id: userId || data.user_id || DEFAULT_USER_ID })
      setSuccess(true)
      reset({
        user_id: userId || DEFAULT_USER_ID,
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      setSubmitError(err.message || 'Gagal mengirim pesan.')
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
      {submitError && <div className="error-box">{submitError}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('user_id', { valueAsNumber: true })} />
        <div style={styles.field}>
          <label htmlFor="name">Nama *</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
          />
          {errors.name && <span className="form-error" style={styles.err}>{errors.name.message}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
          />
          {errors.email && <span className="form-error" style={styles.err}>{errors.email.message}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="subject">Subjek *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            {...register('subject')}
            style={{ ...styles.input, ...(errors.subject ? styles.inputError : {}) }}
          />
          {errors.subject && <span className="form-error" style={styles.err}>{errors.subject.message}</span>}
        </div>
        <div style={styles.field}>
          <label htmlFor="message">Pesan *</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            {...register('message')}
            style={{ ...styles.input, minHeight: 120, ...(errors.message ? styles.inputError : {}) }}
          />
          {errors.message && <span className="form-error" style={styles.err}>{errors.message.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim'}
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
  inputError: {
    borderColor: '#ef4444',
  },
  err: { marginTop: '0.25rem', display: 'block' },
}
