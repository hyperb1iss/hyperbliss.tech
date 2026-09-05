// app/components/ProjectRows.tsx
// The Projects index as a list: name, tagline, description, a few tags, and the
// latest version on the right. Sorted by the caller (newest release first).

import Link from 'next/link'
import type { ProjectSummary } from '@/lib/content'
import { shortName, tagline } from '@/lib/feed'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'

export interface ProjectRow {
  project: ProjectSummary
  version: string | null
  releaseUrl: string | null
}

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const rowStyles = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 3.2rem;
  align-items: start;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.8rem;
  }
`

const Name = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 1.2rem;

  & a {
    color: var(--silk-steel-50);
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-circuit-cyan);
  }
`

const Tagline = styled.span`
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 1.6rem;
  letter-spacing: 0;
  color: var(--text-secondary);
`

const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0.8rem 0 0;
  max-width: 72rem;
  text-wrap: pretty;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.4rem;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  color: var(--silk-steel-400);
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
  padding-top: 0.6rem;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  white-space: nowrap;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    opacity: 0.85;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    opacity: 1;
  }

  @media (max-width: 640px) {
    flex-direction: row;
    align-items: baseline;
    gap: 1.6rem;
    padding-top: 0;
  }
`

export default function ProjectRows({ rows }: { rows: ProjectRow[] }) {
  return (
    <List>
      {rows.map(({ project, version, releaseUrl }, index) => {
        const name = shortName(project.title)
        const sub = tagline(project.title)
        const tags = (project.tags ?? []).filter((t): t is string => t !== null).slice(0, 4)
        return (
          <Reveal as="li" className={rowStyles} key={project.slug} order={index * 0.5}>
            <div>
              <Name>
                <Link href={`/projects/${project.slug}/`}>{name}</Link>
                {sub && <Tagline>{sub}</Tagline>}
              </Name>
              {project.description && <Description>{project.description}</Description>}
              {tags.length > 0 && (
                <Tags>
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </Tags>
              )}
            </div>
            <Meta>
              {version &&
                (releaseUrl ? (
                  <a href={releaseUrl} rel="noopener noreferrer">
                    v{version}
                  </a>
                ) : (
                  <span>v{version}</span>
                ))}
              {project.github && (
                <a href={project.github} rel="noopener noreferrer">
                  GitHub →
                </a>
              )}
            </Meta>
          </Reveal>
        )
      })}
    </List>
  )
}
