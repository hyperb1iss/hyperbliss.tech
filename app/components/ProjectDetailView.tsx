// app/components/ProjectDetailView.tsx
// A project page: name and tagline, tags, then the README-style body with a
// sticky facts rail (version, stars, language, last push, links) and the
// other projects in the same lane.

'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { ProjectSummary } from '@/lib/content'
import { shortName, tagline } from '@/lib/feed'
import type { RepoStats } from '@/lib/github'
import { formatStars, LANES, laneOf, languageColor, relativeTime } from '@/lib/projectLanes'
import type { Heading } from '@/lib/reading'
import Reveal from './front/Reveal'
import ProjectMarkdownRenderer from './ProjectMarkdownRenderer'
import ProjectIcon from './projects/ProjectIcon'

interface ProjectDetailViewProps {
  slug: string
  title: string
  github: string
  body: string | null
  tags?: string[]
  version?: string | null
  releaseUrl?: string | null
  releaseDate?: string | null
  stats?: RepoStats | null
  category?: string | null
  related?: ProjectSummary[]
  headings?: Heading[]
  /** Render-time clock for relative timestamps. */
  now?: number
}

export default function ProjectDetailView({
  slug,
  title,
  github,
  body,
  tags,
  version,
  releaseUrl,
  releaseDate,
  stats,
  category,
  related = [],
  headings = [],
  now = 0,
}: ProjectDetailViewProps) {
  const name = shortName(title)
  const sub = tagline(title)
  const lane = LANES.find((l) => l.id === laneOf(category))
  const pushed = now ? relativeTime(stats?.pushedAt, now) : null
  const released = now ? relativeTime(releaseDate, now) : null

  return (
    <article className="project-detail">
      <Reveal as="div" className="project-detail__hero" order={0}>
        <div className="project-detail__meta">
          <ProjectIcon slug={slug} />
          {lane && (
            <Link className="project-detail__repo" href={`/projects/#${lane.id}`}>
              {lane.label}
            </Link>
          )}
          {version &&
            (releaseUrl ? (
              <a className="project-detail__version" href={releaseUrl} rel="noopener noreferrer">
                v{version}
              </a>
            ) : (
              <span className="project-detail__version">v{version}</span>
            ))}
        </div>
        <h1 className="project-detail__title">
          {name}
          {sub && <span className="project-detail__tagline">{sub}</span>}
        </h1>
      </Reveal>

      <div className="project-detail__layout">
        <div>
          <Reveal className="project-detail__content" order={2}>
            {body && <ProjectMarkdownRenderer content={body} headings={headings} />}
          </Reveal>
          {github && (
            <Reveal className="project-detail__actions" order={3}>
              <a className="project-detail__github" href={github} rel="noopener noreferrer">
                View on GitHub →
              </a>
            </Reveal>
          )}
        </div>

        <Reveal as="aside" className="project-detail__facts" order={1}>
          <section>
            <p className="project-detail__facts-label">Facts</p>
            <dl>
              {version && (
                <>
                  <dt>Version</dt>
                  <dd>
                    {releaseUrl ? (
                      <a href={releaseUrl} rel="noopener noreferrer">
                        v{version}
                      </a>
                    ) : (
                      `v${version}`
                    )}
                    {released && <span style={{ color: 'var(--silk-steel-400)' }}> · {released}</span>}
                  </dd>
                </>
              )}
              {stats && stats.stars > 0 && (
                <>
                  <dt>Stars</dt>
                  <dd>★ {formatStars(stats.stars)}</dd>
                </>
              )}
              {stats && stats.forks > 0 && (
                <>
                  <dt>Forks</dt>
                  <dd>{formatStars(stats.forks)}</dd>
                </>
              )}
              {stats?.language && (
                <>
                  <dt>Language</dt>
                  <dd>
                    <span
                      className="project-detail__lang"
                      style={{ '--lang-color': languageColor(stats.language) } as CSSProperties}
                    >
                      {stats.language}
                    </span>
                  </dd>
                </>
              )}
              {pushed && (
                <>
                  <dt>Pushed</dt>
                  <dd>{pushed}</dd>
                </>
              )}
              {github && (
                <>
                  <dt>Repo</dt>
                  <dd>
                    <a href={github} rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>
          {tags && tags.length > 0 && (
            <section>
              <p className="project-detail__facts-label">Built with</p>
              <div className="project-detail__facts-tags">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>
          )}
          {related.length > 0 && lane && (
            <section>
              <p className="project-detail__facts-label">More in {lane.label}</p>
              <div className="project-detail__related">
                {related.map((p) => (
                  <Link href={`/projects/${p.slug}/`} key={p.slug}>
                    <span className="project-detail__related-name">{shortName(p.title)}</span>
                    {tagline(p.title) && <span className="project-detail__related-tagline">{tagline(p.title)}</span>}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </Reveal>
      </div>
    </article>
  )
}
