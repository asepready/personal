import React, { useState, useEffect, useLayoutEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getTheme } from '../theme'
import mermaid from 'mermaid'

export default function MarkdownContent({ content = '', className, style }) {
  const [theme, setThemeState] = useState(() => (typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') || 'dark') : 'dark'))
  useEffect(() => {
    const onThemeChange = () => setThemeState(getTheme())
    window.addEventListener('themechange', onThemeChange)
    return () => window.removeEventListener('themechange', onThemeChange)
  }, [])
  const highlightStyle = theme === 'light' ? oneLight : oneDark
  return (
    <div className={`markdown-content ${className || ''}`.trim()} style={style}>
      <ReactMarkdown
        components={{
          code({ node, inline, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '')
            const codeString = String(children).replace(/\n$/, '')
            if (!inline && match && match[1] === 'mermaid') {
              return <MermaidDiagram code={codeString} theme={theme} />
            }
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={highlightStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: '1rem 0',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                  }}
                  codeTagProps={{ style: { fontFamily: 'ui-monospace, monospace' } }}
                  showLineNumbers={false}
                >
                  {codeString}
                </SyntaxHighlighter>
              )
            }
            return (
              <code className={codeClassName} style={inlineCodeStyle} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

const inlineCodeStyle = {
  fontFamily: 'ui-monospace, monospace',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  padding: '0.15em 0.4em',
  borderRadius: 4,
  fontSize: '0.9em',
}

function MermaidDiagram({ code, theme }) {
  const [svg, setSvg] = useState('')

  useLayoutEffect(() => {
    let cancelled = false
    async function render() {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'light' ? 'default' : 'dark',
        })
        const { svg: svgCode } = await mermaid.render(`mermaid-${Math.random().toString(36).slice(2, 9)}`, code)
        if (!cancelled) setSvg(svgCode)
      } catch {
        if (!cancelled) setSvg(`<pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`)
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [code, theme])

  return (
    <div
      className="mermaid-diagram"
      style={{ margin: '1.5rem 0', overflowX: 'auto' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
