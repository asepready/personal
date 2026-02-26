import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { getList, getOne, create, update, remove } from '../api'
import { getCurrentUser } from '../auth'
import { resourceConfigs } from '../resourceConfig'
import MarkdownEditor from '../components/MarkdownEditor'

const PER_PAGE = 15

export default function ResourcePage({ config }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [filterOptions, setFilterOptions] = useState({})
  const [formFieldOptions, setFormFieldOptions] = useState({})

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (deleteConfirmId != null) closeDeleteConfirm()
      else if (formOpen) closeForm()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [formOpen, deleteConfirmId])

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

  // Load options for selectRemote filters
  useEffect(() => {
    const list = cfg.listFilters || []
    const remote = list.filter((f) => f.type === 'selectRemote')
    if (remote.length === 0) return
    let cancelled = false
    remote.forEach((f) => {
      getList(f.optionsEndpoint, { per_page: 100 })
        .then((res) => {
          if (cancelled) return
          const data = res?.data ?? res
          const items = data?.data ?? []
          setFilterOptions((prev) => ({
            ...prev,
            [f.key]: items.map((item) => ({
              value: String(item[f.optionValue] ?? ''),
              label: String(item[f.optionLabel] ?? item[f.optionValue] ?? ''),
            })),
          }))
        })
        .catch(() => {
          if (!cancelled) setFilterOptions((prev) => ({ ...prev, [f.key]: [] }))
        })
    })
    return () => { cancelled = true }
  }, [config.path, cfg.listFilters])

  // Load options for form fields with type selectRemote
  useEffect(() => {
    const list = cfg.formFields || []
    const remote = list.filter((f) => f.type === 'selectRemote')
    if (remote.length === 0) return
    let cancelled = false
    remote.forEach((f) => {
      getList(f.optionsEndpoint, { per_page: 100 })
        .then((res) => {
          if (cancelled) return
          const data = res?.data ?? res
          const items = data?.data ?? []
          setFormFieldOptions((prev) => ({
            ...prev,
            [f.key]: items.map((item) => ({
              value: String(item[f.optionValue] ?? ''),
              label: String(item[f.optionLabel] ?? item[f.optionValue] ?? ''),
            })),
          }))
        })
        .catch(() => {
          if (!cancelled) setFormFieldOptions((prev) => ({ ...prev, [f.key]: [] }))
        })
    })
    return () => { cancelled = true }
  }, [config.path, cfg.formFields])

  // Deep link: /blog-posts?edit=id -> open edit modal then clear query
  useEffect(() => {
    const editId = searchParams.get('edit')
    if (config.path !== 'blog-posts' || !editId) return
    const id = parseInt(editId, 10)
    if (Number.isNaN(id) || id < 1) return
    navigate(pathname, { replace: true })
    openEdit(id)
  }, [config.path, pathname, navigate, searchParams])

  const openCreate = () => {
    setEditing(null)
    const currentUser = getCurrentUser()
    const initial = {}
    cfg.formFields.forEach((f) => {
      if (f.key === 'user_id' && currentUser?.id) initial.user_id = currentUser.id
      else if (f.type === 'checkbox') initial[f.key] = false
      else initial[f.key] = ''
    })
    setFormData(initial)
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
      if (config.path === 'contact-messages') {
        values.name = data.name ?? ''
        values.email = data.email ?? ''
        values.subject = data.subject ?? ''
        values.message = data.message ?? ''
      }
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
      if (v === '' || v == null) {
        if (f.type === 'markdown') body[f.key] = ''
        return
      }
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

  const openDeleteConfirm = (id) => setDeleteConfirmId(id)
  const closeDeleteConfirm = () => setDeleteConfirmId(null)

  const handleDelete = async (id) => {
    closeDeleteConfirm()
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
              {f.type === 'selectRemote' && (
                <select
                  value={filters[f.key] ?? ''}
                  onChange={(e) => setFilterValue(f.key, e.target.value)}
                  disabled={filterOptions[f.key] === undefined}
                >
                  <option value="">Semua</option>
                  {(filterOptions[f.key] || []).map((opt) => (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
          <span className="loading-spinner" aria-hidden="true" />
          <span style={{ color: 'var(--color-text-muted)' }}>Memuat...</span>
        </div>
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
                {items.map((row) => {
                  const previewUrl = cfg.previewBaseUrl && cfg.previewSlugField && row[cfg.previewSlugField]
                    ? `${(cfg.previewBaseUrl || '').replace(/\/$/, '')}${cfg.previewPathPrefix || '/blog/'}${row[cfg.previewSlugField]}`
                    : null
                  return (
                    <tr key={row.id}>
                      {cfg.listColumns.map((c) => {
                        const displayRelation = c.displayRelation
                        const cellValue = displayRelation
                          ? (row[displayRelation.key]?.[displayRelation.labelKey] ?? row[c.key] ?? '')
                          : (c.key === 'is_published'
                            ? (row[c.key] ? 'Published' : 'Draft')
                            : c.key === 'is_read' || c.key === 'is_featured' || c.key === 'is_current' || c.key === 'is_active' || c.key === 'is_primary'
                              ? (row[c.key] ? 'Ya' : 'Tidak')
                              : row[c.key])
                        return <td key={c.key}>{String(cellValue ?? '')}</td>
                      })}
                      <td>
                        <button type="button" className="btn btn-sm btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => openEdit(row.id)}>Edit</button>
                        {previewUrl && (
                          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary" style={{ marginRight: '0.5rem' }}>Preview</a>
                        )}
                        {!cfg.createDisabled && (
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => openDeleteConfirm(row.id)}>Hapus</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
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

      {deleteConfirmId != null && (
        <div style={modalStyles.overlay} onClick={closeDeleteConfirm} role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
          <div style={modalStyles.box} className="confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="confirm-delete-title" style={{ margin: '0 0 1rem' }}>Konfirmasi hapus</h3>
            <p style={{ margin: '0 0 1rem', color: 'var(--color-text)' }}>Yakin ingin menghapus?</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)}>Hapus</button>
              <button type="button" className="btn btn-secondary" onClick={closeDeleteConfirm}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={modalStyles.overlay} onClick={closeForm} role="dialog" aria-modal="true">
          <div style={config.path === 'blog-posts' ? { ...modalStyles.box, maxWidth: 900, width: '95%', minHeight: '85vh' } : modalStyles.box} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem' }}>{editing ? 'Edit' : 'Tambah'}</h3>
            {config.path === 'contact-messages' && editing && (
              <div style={readOnlyBlockStyles}>
                <div style={{ marginBottom: '0.5rem' }}><strong>Nama:</strong> {formData.name ?? ''}</div>
                <div style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {formData.email ?? ''}</div>
                <div style={{ marginBottom: '0.5rem' }}><strong>Subjek:</strong> {formData.subject ?? ''}</div>
                <div style={{ marginBottom: '0.75rem' }}><strong>Pesan:</strong></div>
                <pre style={readOnlyPreStyles}>{formData.message ?? ''}</pre>
              </div>
            )}
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
                  {f.type === 'markdown' && (
                    <MarkdownEditor
                      value={formData[f.key] ?? ''}
                      onChange={(v) => setField(f.key, v ?? '')}
                      minHeight={f.minHeight}
                    />
                  )}
                  {f.type === 'checkbox' && (
                    <input
                      type="checkbox"
                      checked={Boolean(formData[f.key])}
                      onChange={(e) => setField(f.key, e.target.checked)}
                    />
                  )}
                  {(f.type === 'text' || f.type === 'email' || f.type === 'number' || f.type === 'password') && (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setField(f.key, f.type === 'number' ? e.target.valueAsNumber : e.target.value)}
                      required={f.required}
                      placeholder={f.type === 'password' && editing ? 'Kosongkan jika tidak diubah' : undefined}
                    />
                  )}
                  {(f.type === 'date' || f.type === 'datetime-local') && (
                    <input
                      type={f.type}
                      value={formData[f.key] ?? ''}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  )}
                  {f.type === 'selectRemote' && (
                    <select
                      value={formData[f.key] !== undefined && formData[f.key] !== null ? String(formData[f.key]) : ''}
                      onChange={(e) => setField(f.key, e.target.value === '' ? '' : (f.optionValue === 'id' ? parseInt(e.target.value, 10) : e.target.value))}
                      required={f.required}
                      disabled={formFieldOptions[f.key] === undefined}
                    >
                      <option value="">-- Pilih --</option>
                      {(formFieldOptions[f.key] || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {formErrors[f.key] && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-danger)' }}>{formErrors[f.key][0]}</span>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Batal</button>
                {cfg.previewBaseUrl && cfg.previewSlugField && formData[cfg.previewSlugField] && (
                  <a
                    href={`${(cfg.previewBaseUrl || '').replace(/\/$/, '')}${cfg.previewPathPrefix || '/blog/'}${formData[cfg.previewSlugField]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Preview
                  </a>
                )}
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

const readOnlyBlockStyles = {
  padding: '0.75rem',
  marginBottom: '1rem',
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: '0.875rem',
}
const readOnlyPreStyles = {
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '0.8125rem',
  maxHeight: 200,
  overflow: 'auto',
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
