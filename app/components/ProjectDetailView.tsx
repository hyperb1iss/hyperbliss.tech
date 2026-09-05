// app/components/ProjectDetailView.tsx
// A project page: name and tagline, tags, version and repo link, then the
// README-style body. Header matches the Projects index rows.

'use client'

import { shortName, tagline } from '@/lib/feed'
import Reveal from './front/Reveal'
import ProjectMarkdownRenderer from './ProjectMarkdownRenderer'

interface ProjectDetailViewProps {
  title: string
  github: string
  body: string | null
  tags?: string[]
  version?: string | null
  releaseUrl?: string | null
}

export default function ProjectDetailView({ title, github, body, tags, version, releaseUrl }: ProjectDetailViewProps) {
  const name = shortName(title)
  const sub = tagline(title)
  return (
    <article className="project-detail">
      <Reveal as="div" className="project-detail__hero" order={0}>
        <div className="project-detail__meta">
          {version &&
            (releaseUrl ? (
              <a className="project-detail__version" href={releaseUrl} rel="noopener noreferrer">
                v{version}
              </a>
            ) : (
              <span className="project-detail__version">v{version}</span>
            ))}
          {github && (
            <a className="project-detail__repo" href={github} rel="noopener noreferrer">
              GitHub →
            </a>
          )}
        </div>
        <h1 className="project-detail__title">
          {name}
          {sub && <span className="project-detail__tagline">{sub}</span>}
        </h1>
        {tags && tags.length > 0 && (
          <div className="project-detail__tags">
            {tags.map((tag) => (
              <span className="project-detail__tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal className="project-detail__content" order={2}>
        {body && <ProjectMarkdownRenderer content={body} />}
      </Reveal>

      {github && (
        <Reveal className="project-detail__actions" order={3}>
          <a className="project-detail__github" href={github} rel="noopener noreferrer">
            View on GitHub →
          </a>
        </Reveal>
      )}
    </article>
  )
}
