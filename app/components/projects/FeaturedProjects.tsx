// The flagship trio at the top of Projects: the most starred repos as glass
// cards with the project's own sigil, a gradient name, the tagline, and live
// facts. Everything here is real data; when GitHub is unreachable the cards
// fall back to the newest releases and simply omit stars.

import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import type { ProjectEntry } from '@/lib/projectLanes'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import { neonTitle } from '../front/neon'
import Reveal from '../front/Reveal'
import ProjectMeta from './ProjectMeta'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 5.6rem;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const cardStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 2.6rem 2.6rem 2.4rem;
  border: 1px solid rgba(162, 89, 255, 0.22);
  border-radius: 6px;
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(162, 89, 255, 0.16), transparent 60%),
    radial-gradient(90% 70% at 100% 100%, rgba(0, 255, 240, 0.08), transparent 60%),
    rgba(12, 10, 24, 0.82);
  overflow: hidden;
  transition:
    border-color var(--duration-slow) var(--ease-silk),
    box-shadow var(--duration-slow) var(--ease-silk),
    transform var(--duration-slow) var(--ease-silk);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
    background-size: 24px 24px;
    -webkit-mask-image: radial-gradient(120% 100% at 100% 0%, rgba(0, 0, 0, 0.6), transparent 70%);
    mask-image: radial-gradient(120% 100% at 100% 0%, rgba(0, 0, 0, 0.6), transparent 70%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(0, 255, 240, 0.45);
    box-shadow:
      0 0 0 1px rgba(0, 255, 240, 0.12),
      0 18px 48px rgba(0, 0, 0, 0.45),
      0 0 40px rgba(0, 255, 240, 0.1);
    transform: translateY(-3px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`

const Sigil = styled.span`
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 0 14px rgba(162, 89, 255, 0.55));
`

const Name = styled.h3`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.8rem;
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: none;
  text-shadow: none;
  margin: 0;

  & a {
    color: inherit;
    text-decoration: none;
  }
`

const Tagline = styled.p`
  font-size: 1.7rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--silk-steel-50);
  margin: -0.4rem 0 0;
  text-wrap: balance;
`

const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  text-wrap: pretty;
  flex: 1;
`

const Rank = styled.span`
  position: absolute;
  top: 2rem;
  right: 2.2rem;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  color: var(--silk-quantum-purple);
`

export default function FeaturedProjects({ entries, now }: { entries: ProjectEntry[]; now: number }) {
  if (entries.length === 0) return null
  return (
    <Grid>
      {entries.map((entry, index) => {
        const name = shortName(entry.project.title)
        const sub = tagline(entry.project.title)
        return (
          <Reveal className={cardStyles} key={entry.project.slug} order={index}>
            <Rank aria-hidden="true">{String(index + 1).padStart(2, '0')}</Rank>
            {entry.project.emoji && <Sigil aria-hidden="true">{entry.project.emoji}</Sigil>}
            <Name className={neonTitle}>
              <Link href={`/projects/${entry.project.slug}/`}>{name}</Link>
            </Name>
            {sub && <Tagline>{sub}</Tagline>}
            {entry.project.description && <Description>{entry.project.description}</Description>}
            <ProjectMeta entry={entry} now={now} />
          </Reveal>
        )
      })}
    </Grid>
  )
}
