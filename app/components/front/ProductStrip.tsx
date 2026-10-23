// The flagship trio as one hairline strip under the intro: what Hyperbliss
// makes, three cells wide, each with a screenshot of the real product, its
// promise, the facts worth showing (version, stars from the floor up), and
// the next step (the product's own site, or its page here). Push recency
// stays out: the feed already says what moved lately. pickFeatured chooses
// the trio and falls back to newest releases when nothing is pinned.

import Image from 'next/image'
import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import { type ProjectEntry, shownStars } from '@/lib/projectLanes'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import { ProductShot } from '../projects/ProductParts'
import { neonTitle } from './neon'
import Reveal from './Reveal'

const Grid = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 5.6rem;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    column-gap: 0;
  }
`

// Reveal renders the <li>, so the cell styles ride along as a class. Equal
// columns come from the grid gap; the hairline between cells is drawn in the
// middle of that gap so every screenshot gets the same width.
const cellStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
  padding: 2.4rem 0;

  &:not(:first-child)::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -2.8rem;
    width: 1px;
    background: rgba(148, 163, 184, 0.1);
  }

  @media (max-width: 760px) {
    padding: 2rem 0;

    &:not(:first-child)::before {
      content: none;
    }
    &:not(:first-child) {
      border-top: 1px solid rgba(148, 163, 184, 0.1);
    }
  }
`

const ShotLink = styled(Link)`
  display: block;
  margin-bottom: 0.8rem;
  border-radius: 8px;
  transition: transform var(--duration-slow) var(--ease-silk);

  &:hover {
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
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
  align-items: baseline;
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

const Next = styled.span`
  margin-left: auto;

  & a {
    font-size: 1.25rem;
  }
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

interface ProductStripProps {
  entries: ProjectEntry[]
  /** Entrance position of the first cell; cells stagger from here. */
  startOrder?: number
}

export default function ProductStrip({ entries, startOrder = 0 }: ProductStripProps) {
  if (entries.length === 0) return null
  return (
    <div>
      <Grid aria-label="Products">
        {entries.map((entry, index) => {
          const { project, version, releaseUrl, stats } = entry
          const name = shortName(project.title)
          const page = `/projects/${project.slug}/`
          const sub = tagline(project.title) ?? project.description
          const stars = shownStars(stats?.stars)
          return (
            <Reveal as="li" className={cellStyles} key={project.slug} order={startOrder + index * 0.3}>
              {project.screenshot && (
                <ShotLink aria-hidden="true" href={page} tabIndex={-1}>
                  <ProductShot>
                    <Image
                      alt=""
                      fill={true}
                      priority={index === 0}
                      sizes="(max-width: 760px) 100vw, 360px"
                      src={project.screenshot}
                    />
                  </ProductShot>
                </ShotLink>
              )}
              <Name className={neonTitle}>
                <Link href={page}>{name}</Link>
              </Name>
              {sub && <Tagline>{sub}</Tagline>}
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
                <Next>
                  {project.website ? (
                    <a href={project.website} rel="noopener noreferrer">
                      Get {name} ↗
                    </a>
                  ) : (
                    <Link href={page}>Learn more →</Link>
                  )}
                </Next>
              </Facts>
            </Reveal>
          )
        })}
      </Grid>
      <Reveal order={startOrder + entries.length * 0.3}>
        <Foot>
          <Link href="/projects/">All products and open source →</Link>
        </Foot>
      </Reveal>
    </div>
  )
}
