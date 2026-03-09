import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import StatusBadge from './StatusBadge'
import RowActionsMenu from './RowActionsMenu'

/**
 * Generic data table with TanStack Table.
 * - Status badge for is_published column
 * - Relation display (e.g. user.full_name) for displayRelation columns
 * - Row actions kebab menu (Edit, Duplicate, Preview, Delete)
 * - Pagination at bottom right
 */
export default function DataTable({
  columns: columnConfigs,
  data,
  getPreviewUrl,
  onEdit,
  onDuplicate,
  onDelete,
  createDisabled,
  page,
  totalPages,
  onPageChange,
  loading,
}) {
  const columnHelper = createColumnHelper()

  const columns = [
    ...columnConfigs.map((c) =>
      columnHelper.accessor(
        (row) => {
          if (c.key === 'is_published') return row.is_published
          if (c.displayRelation) {
            const rel = row[c.displayRelation.key]
            return rel?.[c.displayRelation.labelKey] ?? row[c.key] ?? ''
          }
          if (['is_read', 'is_featured', 'is_current', 'is_active', 'is_primary'].includes(c.key))
            return row[c.key] ? 'Ya' : 'Tidak'
          return row[c.key]
        },
        {
          id: c.key,
          header: c.label,
          cell: ({ row, getValue }) => {
            if (c.key === 'is_published')
              return <StatusBadge published={row.original.is_published} />
            return String(getValue() ?? '')
          },
        }
      )
    ),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const previewUrl = getPreviewUrl ? getPreviewUrl(row.original) : null
        return (
          <RowActionsMenu
            onEdit={() => onEdit(row.original.id)}
            onDuplicate={() => onDuplicate(row.original.id)}
            previewUrl={previewUrl}
            onDelete={() => onDelete(row.original.id)}
            createDisabled={createDisabled}
          />
        )
      },
    }),
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4">
        <span className="loading-spinner" aria-hidden="true" />
        <span className="text-[var(--color-text-muted)]">Memuat...</span>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-[var(--color-border)] px-3 py-3 text-left text-sm font-semibold text-[var(--color-text-muted)]"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--color-border)]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-3 text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <p className="py-4 text-[var(--color-text-muted)]">Belum ada data.</p>
      )}
      {totalPages > 1 && (
        <div className="admin-pagination mt-4 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Sebelumnya
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            Halaman {page} dari {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </>
  )
}
