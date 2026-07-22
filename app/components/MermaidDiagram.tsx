// app/components/MermaidDiagram.tsx
'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

/**
 * Renders ```mermaid fenced blocks as inline SVG, themed to SilkCircuit.
 * The mermaid bundle is heavy, so it loads on demand the first time a
 * diagram mounts and the configured instance is shared module-wide.
 */

let mermaidLoader: Promise<typeof import('mermaid').default> | null = null

function loadMermaid(): Promise<typeof import('mermaid').default> {
  if (!mermaidLoader) {
    mermaidLoader = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        flowchart: { curve: 'basis', htmlLabels: true, padding: 12 },
        fontFamily: 'var(--font-body), sans-serif',
        securityLevel: 'strict',
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background: '#12101c',
          clusterBkg: 'rgba(162, 89, 255, 0.08)',
          clusterBorder: 'rgba(162, 89, 255, 0.4)',
          darkMode: true,
          edgeLabelBackground: '#181426',
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '15px',
          lineColor: '#00fff0',
          mainBkg: '#1e1930',
          nodeBorder: '#a259ff',
          primaryBorderColor: '#a259ff',
          primaryColor: '#1e1930',
          primaryTextColor: '#e8e3f4',
          secondaryBorderColor: '#ff75d8',
          secondaryColor: '#2a1b38',
          secondaryTextColor: '#e8e3f4',
          tertiaryBorderColor: '#00fff0',
          tertiaryColor: '#181426',
          tertiaryTextColor: '#e8e3f4',
          textColor: '#e8e3f4',
          titleColor: '#ff75d8',
        },
      })
      return mermaid
    })
  }
  return mermaidLoader
}

interface MermaidDiagramProps {
  code: string
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const reactId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`

    loadMermaid()
      .then((mermaid) => mermaid.render(renderId, code))
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
      .catch((error) => {
        console.error('Mermaid render failed:', error)
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [code, reactId])

  if (failed) {
    return (
      <pre className="blog-code blog-syntax">
        <code>{code}</code>
      </pre>
    )
  }

  return <div className="silk-mermaid silk-breakout-wide" ref={containerRef} />
}

export default MermaidDiagram
