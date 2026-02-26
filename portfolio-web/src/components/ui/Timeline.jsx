import React from 'react'

/**
 * Generic vertical timeline component for experience / education.
 * Expects items shaped as:
 * { id, title, subtitle, period, location, description }
 */
export default function Timeline({ items = [] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="timeline">
      {items.map((item) => (
        <div key={item.id} className="timeline-item">
          <div className="timeline-marker" aria-hidden="true" />
          <article className="timeline-card">
            <div className="timeline-card-header">
              <h2 className="timeline-card-title">{item.title}</h2>
              {item.period && <span className="timeline-card-meta">{item.period}</span>}
            </div>
            {item.subtitle && <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>{item.subtitle}</p>}
            {item.location && (
              <p style={{ margin: '0.25rem 0', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                {item.location}
              </p>
            )}
            {item.description && (
              <p style={{ margin: '0.75rem 0 0', fontSize: '0.9375rem' }}>
                {item.description}
              </p>
            )}
          </article>
        </div>
      ))}
    </div>
  )
}

