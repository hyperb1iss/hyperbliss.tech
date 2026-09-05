// app/components/BlogPost.tsx
// An essay: kind and date, sentence-case title, tags, then the prose. The
// header matches the front page lead story; the body keeps the blog prose
// styles from blog.css.

'use client'

import type { ReactNode } from 'react'
import Badge from './front/Badge'
import { longDate } from './front/format'
import Reveal from './front/Reveal'
import MarkdownRenderer from './MarkdownRenderer'
import { BlogContent } from './MarkdownStyles'

interface BlogPostProps {
  title: string
  date: string
  content: string
  author?: string
  tags?: string[]
  /** Optional slot rendered under the tags, e.g. a kind-specific note. */
  aside?: ReactNode
}

/** A bare ISO date renders from its parts so no timezone can shift the day. */
function isoDay(value: string): string | null {
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const time = new Date(trimmed).getTime()
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10)
}

export default function BlogPost({ title, date, content, tags, aside }: BlogPostProps) {
  const day = isoDay(date)
  return (
    <article className="blog-post">
      <Reveal as="div" className="blog-post__header" order={0}>
        <div className="blog-post__meta">
          <Badge kind="essay" />
          {day && (
            <time className="blog-post__date" dateTime={day}>
              {longDate(day)}
            </time>
          )}
        </div>
        <h1 className="blog-post__title">{title}</h1>
        {tags && tags.length > 0 && (
          <div className="blog-post__tags">
            {tags.map((tag) => (
              <span className="blog-post__tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {aside}
      </Reveal>
      <Reveal order={2}>
        <BlogContent>
          <MarkdownRenderer content={content} />
        </BlogContent>
      </Reveal>
    </article>
  )
}
