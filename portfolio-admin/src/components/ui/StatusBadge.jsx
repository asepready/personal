/**
 * Status badge for data tables (FR-31).
 * Published → green; Draft → yellow.
 */
export default function StatusBadge({ published }) {
  const isPublished = Boolean(published)
  return (
    <span
      className={isPublished ? 'status-badge status-badge--published' : 'status-badge status-badge--draft'}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}
