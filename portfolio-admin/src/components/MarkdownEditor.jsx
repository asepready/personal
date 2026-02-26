import { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { getTheme } from '../theme'
import mermaid from 'mermaid'

function parseHeight(v) {
  if (typeof v === 'number') return v
  if (typeof v === 'string' && /^\d+/.test(v)) return parseInt(v, 10) || 320
  return 320
}

// Render blok kode Mermaid sebagai diagram di preview
function MermaidBlock({ code }) {
  const ref = useRef(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!ref.current || !code) return
    setErr(null)
    ref.current.textContent = code
    ref.current.removeAttribute('data-processed')
    mermaid
      .run({ nodes: [ref.current], suppressErrors: true })
      .catch((e) => setErr(String(e.message || e)))
  }, [code])

  if (err) {
    return (
      <pre className="language-mermaid" style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 6 }}>
        <code>{code}</code>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}>{err}</div>
      </pre>
    )
  }

  return <div ref={ref} className="mermaid" style={{ margin: '1rem 0' }} />
}

function CustomCode({ node, inline, className, children, ...props }) {
  const code = String(children ?? '').replace(/\n$/, '')
  const isMermaid = className?.includes('language-mermaid')
  if (isMermaid && !inline) {
    return <MermaidBlock code={code} />
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export default function MarkdownEditor({ value = '', onChange, placeholder, minHeight = 320 }) {
  const height = parseHeight(minHeight)
  const [colorMode, setColorMode] = useState(() => (typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') || 'dark') : 'dark'))
  useEffect(() => {
    const onThemeChange = () => setColorMode(getTheme())
    window.addEventListener('themechange', onThemeChange)
    return () => window.removeEventListener('themechange', onThemeChange)
  }, [])

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: colorMode === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    })
  }, [colorMode])

  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        visibleDragbar
        preview="live"
        previewOptions={{
          components: { code: CustomCode },
        }}
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6 }}
      />
    </div>
  )
}
