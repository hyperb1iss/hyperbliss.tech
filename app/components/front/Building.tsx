// The flagship trio as one hairline strip under the lead: what gets built
// here, three cells wide, with the live facts the feed never carries (what a
// project is, its version, its stars). Push recency stays out: the feed
// already says what moved lately, and a months-old push date under a
// "Building" marker reads as a contradiction. pickFeatured chooses the trio
// and falls back to newest releases when GitHub is unreachable; each cell
// only renders the facts it has.

import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import { formatStars, type ProjectEntry } from '@/lib/projectLanes'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import { neonTitle } from './neon'
import Reveal from './Reveal'

const Grid = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(148, 163, 184, 0.14);
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

// Reveal renders the <li>, so the cell styles ride along as a class.
const cellStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
  padding: 2.4rem 2.8rem 2.4rem 0;

  &:not(:first-child) {
    padding-left: 2.8rem;
    border-left: 1px solid rgba(148, 163, 184, 0.1);
  }

  @media (max-width: 760px) {
    padding: 2rem 0;

    &:not(:first-child) {
      padding-left: 0;
      border-left: 0;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
    }
  }
`

const Name = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  margin: 0;

  & a {
    color: inherit;
    text-decoration: none;
  }
  &:hover {
    filter: drop-shadow(0 0 22px rgba(0, 255, 240, 0.35));
  }
`

const Tagline = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.35;
  color: var(--silk-steel-50);
  margin: 0;
  text-wrap: pretty;
`

const Facts = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.6rem;
  margin: auto 0 0;
  padding-top: 0.4rem;
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

const Stars = styled.span`
  color: var(--silk-lavender);
`

const Foot = styled.div`
  padding-top: 1.8rem;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.06em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

interface BuildingProps {
  entries: ProjectEntry[]
  projectCount: number
  /** Entrance position of the first cell; cells stagger from here. */
  startOrder?: number
}

export default function Building({ entries, projectCount, startOrder = 0 }: BuildingProps) {
  if (entries.length === 0) return null
  return (
    <div>
      <Grid aria-label="Featured projects">
        {entries.map((entry, index) => {
          const { project, version, releaseUrl, stats } = entry
          const sub = tagline(project.title) ?? project.description
          const stars = stats && stats.stars > 0 ? formatStars(stats.stars) : null
          return (
            <Reveal as="li" className={cellStyles} key={project.slug} order={startOrder + index * 0.3}>
              <Name className={neonTitle}>
                <Link href={`/projects/${project.slug}/`}>{shortName(project.title)}</Link>
              </Name>
              {sub && <Tagline>{sub}</Tagline>}
              {(version || stars) && (
                <Facts>
                  {version &&
                    (releaseUrl ? (
                      <a href={releaseUrl} rel="noopener noreferrer">
                        v{version}
                      </a>
                    ) : (
                      <span>v{version}</span>
                    ))}
                  {stars && <Stars>★ {stars}</Stars>}
                </Facts>
              )}
            </Reveal>
          )
        })}
      </Grid>
      <Reveal order={startOrder + entries.length * 0.3}>
        <Foot>
          <Link href="/projects/">All {projectCount} projects →</Link>
        </Foot>
      </Reveal>
    </div>
  )
}
