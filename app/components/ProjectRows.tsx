// app/components/ProjectRows.tsx
// A product line's supporting projects as rows: sigil, name and tagline,
// description, and the live facts (version, stars, language, last push) on
// the right. The flagship above carries the screenshot and the pitch.

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
  border-bottom: 1px solid rgba(244, 240, 255, 0.08);
  transition: background var(--duration-normal) var(--ease-silk);

  &:hover {
    background: linear-gradient(90deg, rgba(225, 53, 255, 0.07), transparent 60%);
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
  font-stretch: 112%;
  font-weight: 800;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 1.2rem;

  & a {
    color: #f6f2ff;
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-circuit-cyan);
  }
`

const Tagline = styled.span`
  font-family: var(--font-body);
  font-stretch: 100%;
  font-weight: 400;
  font-size: 1.6rem;
  letter-spacing: 0;
  color: #b9b0cc;
`

const Description = styled.p`
  font-size: 1.55rem;
  font-weight: 300;
  line-height: 1.55;
  color: #cfc8de;
  margin: 0.8rem 0 0;
  max-width: 72rem;
  text-wrap: pretty;
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
        return (
          <Reveal as="li" className={rowStyles} key={project.slug} order={startOrder + index * 0.5}>
            <ProjectIcon slug={project.slug} />
            <div>
              <Name>
                <Link href={`/projects/${project.slug}/`}>{name}</Link>
                {/* Space for the accessible name; the flex gap draws the gap. */}
                {sub && (
                  <>
                    {' '}
                    <Tagline>{sub}</Tagline>
                  </>
                )}
              </Name>
              {project.description && <Description>{project.description}</Description>}
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
