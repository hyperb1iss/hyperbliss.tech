// app/components/BlogPost.tsx
// An essay: kind, date, and reading time; sentence-case title; tags; then the
// prose with a sticky table of contents beside it on wide screens and a
// "keep reading" footer with the neighboring essays.

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Heading } from '@/lib/reading'
import Badge from './front/Badge'
import { longDate } from './front/format'
import Reveal from './front/Reveal'
import MarkdownRenderer from './MarkdownRenderer'
import { BlogContent } from './MarkdownStyles'

export interface PostNeighbor {
  slug: string
  title: string
  date: string | null
}

interface BlogPostProps {
  title: string
  date: string
  content: string
  tags?: string[]
  headings?: Heading[]
  readingMinutes?: number
  prev?: PostNeighbor | null
  next?: PostNeighbor | null
}

/** A bare ISO date renders from its parts so no timezone can shift the day. */
function isoDay(value: string): string | null {
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const time = new Date(trimmed).getTime()
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10)
}

/** Sticky outline that tracks the heading currently in view. */
function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (headings.length === 0) return
    const targets = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )
    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null
  return (
    <nav aria-label="On this page" className="blog-post__toc">
      <p className="blog-post__toc-label">On this page</p>
      <ol>
        {headings.map((h) => (
          <li data-active={active === h.id ? 'true' : undefined} data-level={h.level} key={h.id}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function BlogPost({
  title,
  date,
  content,
  tags,
  headings = [],
  readingMinutes,
  prev,
  next,
}: BlogPostProps) {
  const day = isoDay(date)
  return (
    <article className="blog-post">
      <div className="blog-post__layout">
        <div className="blog-post__body">
          <Reveal as="div" className="blog-post__header" order={0}>
            <div className="blog-post__meta">
              <Badge kind="essay" />
              {day && (
                <time className="blog-post__date" dateTime={day}>
                  {longDate(day)}
                </time>
              )}
              {readingMinutes && <span className="blog-post__reading">{readingMinutes} min read</span>}
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
          </Reveal>
          <Reveal order={2}>
            <BlogContent>
              <MarkdownRenderer content={content} headings={headings} />
            </BlogContent>
          </Reveal>
          {(prev || next) && (
            <Reveal as="div" className="blog-post__footer" order={3}>
              <p className="blog-post__footer-label">Keep reading</p>
              <div className="blog-post__neighbors">
                {prev ? (
                  <Link className="blog-post__neighbor" href={`/blog/${prev.slug}/`}>
                    <span className="blog-post__neighbor-kicker">← Older</span>
                    <span className="blog-post__neighbor-title">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link className="blog-post__neighbor blog-post__neighbor--next" href={`/blog/${next.slug}/`}>
                    <span className="blog-post__neighbor-kicker">Newer →</span>
                    <span className="blog-post__neighbor-title">{next.title}</span>
                  </Link>
                )}
              </div>
              <div className="blog-post__footer-links">
                <Link href="/blog/">All writing →</Link>
              </div>
            </Reveal>
          )}
        </div>
        <Reveal as="aside" order={1}>
          <TableOfContents headings={headings} />
        </Reveal>
      </div>
    </article>
  )
}
