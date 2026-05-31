// app/components/MarkdownFigure.tsx
'use client'

import React from 'react'

/**
 * Authoring model for blog images:
 *
 *   ![A screenshot](/images/blog/foo.png "Optional caption")             -> figure at text-column width (default)
 *   ![[wide] A diagram](/images/blog/wide.png "Caption")                 -> breaks out a little wider than the text
 *   ![[full] A hero shot](/images/blog/hero.png "Caption")               -> full-bleed figure
 *   ![[right] Ghostty tabs](/images/blog/tabs.png "14 tabs at 2am") text -> floats right, text wraps
 *   ![[left] ...](/images/blog/x.png) text after it in the same para     -> floats left, text wraps
 *
 * Default placement aligns the figure to the prose measure so images never sit
 * wider than the text. [wide] and [full] are opt-in breakouts. The placement
 * keyword is an optional [bracketed] token at the START of the alt text and is
 * stripped from the accessible alt. Caption falls back to the (cleaned) alt
 * when no title is supplied. Floats must be written inline at the start of a
 * paragraph that continues with text; everything else goes on its own line.
 */

type Placement = 'wide' | 'full' | 'text' | 'left' | 'right'

const PLACEMENTS = new Set<Placement>(['wide', 'full', 'text', 'left', 'right'])

interface ParsedImageMeta {
  placement: Placement
  alt: string
  caption?: string
}

export function parseImageMeta(rawAlt: string | undefined, rawTitle: string | undefined): ParsedImageMeta {
  const alt = rawAlt ?? ''
  const match = alt.match(/^\s*\[([a-zA-Z]+)\]\s*([\s\S]*)$/)

  let placement: Placement = 'text'
  let cleanAlt = alt
  if (match) {
    const token = match[1].toLowerCase() as Placement
    if (PLACEMENTS.has(token)) {
      placement = token
      cleanAlt = match[2]
    }
  }
  cleanAlt = cleanAlt.trim()

  const title = rawTitle?.trim()
  const caption = title || cleanAlt || undefined

  return { alt: cleanAlt, caption, placement }
}

interface MarkdownFigureProps {
  src?: string | Blob
  alt?: string
  title?: string
}

const MarkdownFigure: React.FC<MarkdownFigureProps> = ({ src, alt, title }) => {
  const { placement, alt: cleanAlt, caption } = parseImageMeta(alt, title)

  if (typeof src !== 'string' || src.length === 0) return null

  const image = <img alt={cleanAlt} decoding="async" loading="lazy" src={src} />

  if (placement === 'left' || placement === 'right') {
    return (
      <span className={`silk-float silk-float--${placement}`}>
        <span className="silk-float__frame">{image}</span>
        {caption ? <span className="silk-float__cap">{caption}</span> : null}
      </span>
    )
  }

  const breakout =
    placement === 'full' ? 'silk-breakout-full' : placement === 'text' ? 'silk-breakout-text' : 'silk-breakout-wide'

  return (
    <figure className={`silk-figure ${breakout}`}>
      <span className="silk-figure__frame">{image}</span>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

export default MarkdownFigure
