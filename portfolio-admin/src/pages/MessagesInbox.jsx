import { useState, useEffect, useCallback } from 'react'
import { getList, update } from '../api'

export default function MessagesInbox() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getList('contact-messages', { per_page: 50 })
      const data = res?.data ?? res
      setItems(data?.data ?? [])
      if (!selected && (data?.data ?? []).length > 0) setSelected((data?.data ?? [])[0].id)
    } catch (_) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const selectedItem = items.find((m) => m.id === selected)
  const unreadCount = items.filter((m) => !m.is_read).length

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      await Promise.all(
        items.filter((m) => !m.is_read).map((m) => update('contact-messages', m.id, { is_read: 1 }))
      )
      await fetchMessages()
    } finally {
      setMarkingAll(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await update('contact-messages', id, { is_read: 1 })
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)))
    } catch (_) {}
  }

  const formatDate = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    const now = new Date()
    const sameDay = dt.toDateString() === now.toDateString()
    if (sameDay) return dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (dt.toDateString() === yesterday.toDateString()) return 'Kemarin'
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Pesan Kontak</h2>
      <div className="messages-inbox">
        <div className="messages-list">
          <div className="messages-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Daftar pesan</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleMarkAllRead}
                disabled={markingAll}
              >
                {markingAll ? '...' : 'Mark all Read'}
              </button>
            )}
          </div>
          {loading ? (
            <div style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Memuat...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Belum ada pesan.</div>
          ) : (
            items.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`messages-list-item ${!m.is_read ? 'unread' : ''}`}
                onClick={() => {
                  setSelected(m.id)
                  if (!m.is_read) handleMarkRead(m.id)
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: !m.is_read ? 600 : 400, fontSize: '0.9375rem' }}>
                    {m.subject || '(No subject)'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    {formatDate(m.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {m.name || m.email}
                </div>
              </button>
            ))
          )}
        </div>
        <div className="messages-detail">
          {selectedItem ? (
            <>
              <h3 style={{ margin: '0 0 0.5rem' }}>{selectedItem.subject || '(No subject)'}</h3>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                From: {selectedItem.email}
                {selectedItem.name && ` (${selectedItem.name})`}
              </p>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {formatDate(selectedItem.created_at)}
              </p>
              <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>
                {selectedItem.message || ''}
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${selectedItem.email}?subject=Re: ${encodeURIComponent(selectedItem.subject || '')}`}
                  className="btn btn-primary"
                >
                  Reply to Email
                </a>
                {!selectedItem.is_read && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleMarkRead(selectedItem.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>Pilih pesan untuk melihat detail.</p>
          )}
        </div>
      </div>
    </div>
  )
}
