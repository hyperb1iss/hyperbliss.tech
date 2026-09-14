// app/components/ProjectRows.tsx
// A lane's projects as rows: sigil, name and tagline, description, a few tags,
// and the live facts (version, stars, language, last push) on the right.

import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import type { ProjectEntry } from '@/lib/projectLanes'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import ProjectIcon from './projects/ProjectIcon'
import ProjectMeta from './projects/ProjectMeta'

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const rowStyles = css`
  display: grid;
  grid-template-columns: 3.6rem minmax(0, 1fr) auto;
  column-gap: 2rem;
  align-items: start;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  transition: background var(--duration-normal) var(--ease-silk);

  &:hover {
    background: linear-gradient(90deg, rgba(162, 89, 255, 0.06), transparent 60%);
  }

  @media (max-width: 760px) {
    grid-template-columns: 3.2rem minmax(0, 1fr);
    row-gap: 0.8rem;
    & > :last-child {
      grid-column: 2;
    }
  }
`

const Name = styled.h3`
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
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    transition:
      color var(--duration-normal) var(--ease-silk),
      text-shadow var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-steel-50);
    text-shadow: 0 0 18px rgba(0, 255, 240, 0.6);
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
  padding-top: 0.6rem;
  text-align: right;

  & > div {
    justify-content: flex-end;
  }

  @media (max-width: 760px) {
    text-align: left;
    padding-top: 0;
    & > div {
      justify-content: flex-start;
    }
  }
`

export default function ProjectRows({
  entries,
  now,
  startOrder = 0,
}: {
  entries: ProjectEntry[]
  now: number
  startOrder?: number
}) {
  return (
    <List>
      {entries.map((entry, index) => {
        const { project } = entry
        const name = shortName(project.title)
        const sub = tagline(project.title)
        const tags = (project.tags ?? []).filter((t): t is string => t !== null).slice(0, 4)
        return (
          <Reveal as="li" className={rowStyles} key={project.slug} order={startOrder + index * 0.5}>
            <ProjectIcon slug={project.slug} />
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
              <ProjectMeta entry={entry} now={now} />
            </Meta>
          </Reveal>
        )
      })}
    </List>
  )
}
