import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

/**
 * Kebab (⋮) row actions: Edit, Duplicate, Preview, Delete.
 * Uses Headless UI Menu for a11y and focus management.
 */
export default function RowActionsMenu({
  onEdit,
  onDuplicate,
  previewUrl,
  onDelete,
  createDisabled,
}) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="admin-kebab-btn inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
        aria-label="Menu aksi"
      >
        ⋮
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="admin-kebab-menu mt-0.5 min-w-[140px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg outline-none"
      >
        <MenuItem>
          <button
            type="button"
            onClick={onEdit}
            className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-text)] data-[focus]:bg-[var(--color-border)]"
          >
            Edit
          </button>
        </MenuItem>
        {!createDisabled && (
          <MenuItem>
            <button
              type="button"
              onClick={onDuplicate}
              className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-text)] data-[focus]:bg-[var(--color-border)]"
            >
              Duplicate
            </button>
          </MenuItem>
        )}
        {previewUrl && (
          <MenuItem>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-text)] data-[focus]:bg-[var(--color-border)]"
            >
              Preview
            </a>
          </MenuItem>
        )}
        {!createDisabled && (
          <MenuItem>
            <button
              type="button"
              onClick={onDelete}
              className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--color-danger)] data-[focus]:bg-[var(--color-border)]"
            >
              Hapus
            </button>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  )
}
