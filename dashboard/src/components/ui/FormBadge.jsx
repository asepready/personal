/**
 * Badge "Posting sebagai: [Nama Anda]" (FR-07).
 * Display only; user_id is set from session on submit.
 */
export default function FormBadge({ userName }) {
  if (!userName) return null
  return (
    <p className="mb-4 text-[0.8125rem] text-[var(--color-text-muted)]" data-form-badge>
      Posting sebagai: <strong className="text-[var(--color-text)]">{userName}</strong>
    </p>
  )
}
