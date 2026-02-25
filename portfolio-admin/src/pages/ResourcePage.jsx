import { useState, useEffect, useCallback } from 'react'
import { getList, getOne, create, update, remove } from '../api'
import { resourceConfigs } from '../resourceConfig'

const PER_PAGE = 15

export default function ResourcePage({ config }) {
  const cfg = resourceConfigs[config.path] || {
    endpoint: config.endpoint,
    listColumns: [{ key: 'id', label: 'ID' }],
    formFields: [],
  }
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState({})

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, per_page: PER_PAGE }
      const listFilters = cfg.listFilters || []
      listFilters.forEach((f) => {
        const v = filters[f.key]
        if (v !== '' && v != null) params[f.key] = v
      })
      const res = await getList(cfg.endpoint, params)
      const data = res?.data ?? res
      setItems(data?.data ?? [])
      setTotal(data?.total ?? 0)
    } catch (e) {
      setError(e.message || 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [cfg.endpoint, cfg.listFilters, page, filters])

  useEffect(() => { fetchList() }, [fetchList])

  const openCreate = () => {
    setEditing(null)
    setFormData({})
    setFormErrors({})
    setFormOpen(true)
  }

  const openEdit = async (id) => {
    setFormErrors({})
    try {
      const res = await getOne(cfg.endpoint, id)
      const data = res?.data ?? res
      const values = {}
      cfg.formFields.forEach((f) => {
        let v = data[f.key]
        if (f.type === 'checkbox') v = Boolean(v)
        if (f.type === 'date' && v) v = v.slice(0, 10)
        if (f.type === 'datetime-local' && v) v = v.slice(0, 16)
        values[f.key] = v ?? ''
      })
      setFormData(values)
      setEditing(id)
      setFormOpen(true)
    } catch (e) {
      setToast({ type: 'error', text: e.message || 'Gagal memuat data.' })
    }
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setFormData({})
    setFormErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    setSubmitLoading(true)
    const body = {}
    cfg.formFields.forEach((f) => {
      let v = formData[f.key]
      if (f.type === 'checkbox') v = v ? 1 : 0
      if (v === '' || v == null) return
      body[f.key] = v
    })
    try {
      if (editing) {
        await update(cfg.endpoint, editing, body)
        setToast({ type: 'success', text: 'Berhasil diperbarui.' })
      } else {
        await create(cfg.endpoint, body)
        setToast({ type: 'success', text: 'Berhasil ditambah.' })
      }
      closeForm()
      fetchList()
    } catch (e) {
      if (e.errors) setFormErrors(e.errors)
      setToast({ type: 'error', text: e.message || 'Gagal menyimpan.' })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return
    try {
      await remove(cfg.endpoint, id)
      setToast({ type: 'success', text: 'Berhasil dihapus.' })
      fetchList()
    } catch (e) {
      setToast({ type: 'error', text: e.message || 'Gagal menghapus.' })
    }
  }

  const setField = (key, value) => {
    setFormData((d) => ({ ...d, [key]: value }))
    setFormErrors((e) => ({ ...e, [key]: null }))
  }

  const setFilterValue = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({})
    setPage(1)
  }

  const totalPages = Math.ceil(total / PER_PAGE) || 1
  const hasListFilters = cfg.listFilters?.length > 0
  const hasActiveFilters = hasListFilters && Object.values(filters).some((v) => v !== '' && v != null)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>{config.label}</h2>
        {!cfg.createDisabled && (
          <button type="button" className="btn btn-primary" onClick={openCreate}>Tambah</button>
        )}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <p style={{ color: 'var(--color-danger)', margin: 0 }}>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={() => { setError(null); fetchList(); }}>
            Coba lagi
          </button>
        </div>
      )}

      {hasListFilters && (
        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '0.75rem' }}>
          {cfg.listFilters.map((f) => (
            <div key={f.key} style={{ minWidth: 120 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {f.label}
              </label>
              {f.type === 'number' && (
                <input
                  type="number"
                  value={filters[f.key] ?? ''}
                  onChange={(e) => setFilterValue(f.key, e.target.value === '' ? '' : e.target.value)}
                  placeholder="Semua"
                />
              )}
              {f.type === 'select' && (
                <select
                  value={filters[f.key] ?? ''}
                  onChange={(e) => setFilterValue(f.key, e.target.value)}
                >
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          {hasActiveFilters && (
            <button type="button" className="btn btn-secondary" onClick={resetFilters}>
              Reset filter
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {cfg.listColumns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    {cfg.listColumns.map((c) => (
                      <td key={c.key}>
                        {c.key === 'is_read' || c.key === 'is_published' || c.key === 'is_featured' || c.key === 'is_current' || c.key === 'is_active' || c.key === 'is_primary'
                          ? (row[c.key] ? 'Ya' : 'Tidak')
                          : String(row[c.key] ?? '')}
                      </td>
                    ))}
                    <td>
                      <button type="button" className="btn btn-sm btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => openEdit(row.id)}>Edit</button>
                      {!cfg.createDisabled && (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>Hapus</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada data.</p>}
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</button>
              <span style={{ fontSize: '0.875rem' }}>Halaman {page} dari {totalPages}</span>
              <button className="btn btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Selanjutnya</button>
            </div>
          )}
        </>
      )}

      {formOpen && (
        <div style={modalStyles.overlay} onClick={closeForm}>
          <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem' }}>{editing ? 'Edit' : 'Tambah'}</h3>
            <form onSubmit={handleSubmit}>
              {cfg.formFields.map((f) => (
                <div key={f.key} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    {f.label} {f.required && '*'}
                  </label>
                  {f.type === 'textarea' && (
                    <textarea
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setField(f.key, e.target.value)}
                      rows={3}
                      required={f.required}
                    />
                  )}
                  {f.type === 'checkbox' && (
                    <input
                      type="checkbox"
                      checked={Boolean(formData[f.key])}
                      onChange={(e) => setField(f.key, e.target.checked)}
                    />
                  )}
                  {(f.type === 'text' || f.type === 'email' || f.type === 'number') && (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setField(f.key, f.type === 'number' ? e.target.valueAsNumber : e.target.value)}
                      required={f.required}
                    />
                  )}
                  {(f.type === 'date' || f.type === 'datetime-local') && (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  )}
                  {formErrors[f.key] && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-danger)' }}>{formErrors[f.key][0]}</span>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`} role="alert">
          {toast.text}
        </div>
      )}
    </div>
  )
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  box: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: '1.5rem',
    maxWidth: 480,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
}
