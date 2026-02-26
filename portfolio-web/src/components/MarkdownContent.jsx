import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownContent({ content = '', className, style }) {
  return (
    <div className={`markdown-content ${className || ''}`.trim()} style={style}>
      <ReactMarkdown
        components={{
          code({ node, inline, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '')
            const codeString = String(children).replace(/\n$/, '')
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
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
