// The mono fact row shared by featured cards and lane rows: version, stars,
// language, last push. Only renders what it has.

import type { CSSProperties } from 'react'
import type { ProjectEntry } from '@/lib/projectLanes'
import { formatStars, languageColor, relativeTime } from '@/lib/projectLanes'
import { styled } from '../../../styled-system/jsx'

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1.8rem;
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.04em;
  color: var(--silk-steel-400);
  white-space: nowrap;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    opacity: 0.9;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    opacity: 1;
  }
`

const Lang = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  &::before {
    content: '';
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--lang-color);
    box-shadow: 0 0 8px var(--lang-color);
  }
`

const Stars = styled.span`
  color: var(--silk-lavender);
`

export default function ProjectMeta({ entry, now }: { entry: ProjectEntry; now: number }) {
  const { version, releaseUrl, stats, project } = entry
  const pushed = relativeTime(stats?.pushedAt, now)
  return (
    <Row>
      {version &&
        (releaseUrl ? (
          <a href={releaseUrl} rel="noopener noreferrer">
            v{version}
          </a>
        ) : (
          <span>v{version}</span>
        ))}
      {stats && stats.stars > 0 && <Stars>★ {formatStars(stats.stars)}</Stars>}
      {stats?.language && (
        <Lang style={{ '--lang-color': languageColor(stats.language) } as CSSProperties}>{stats.language}</Lang>
      )}
      {pushed && <span>pushed {pushed}</span>}
      {project.github && (
        <a href={project.github} rel="noopener noreferrer">
          GitHub →
        </a>
      )}
    </Row>
  )
}
