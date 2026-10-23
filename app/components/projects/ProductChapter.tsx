// One product as an Emission chapter: a pool of its line's light behind it,
// the name set huge and expanded, its one-line pitch, and the primary action
// (the product's own site when it has one, else the Install section of its
// page here) beside a tilted, floating screenshot of the real product. Shared
// by the front page and the Products page; `flip` puts the screenshot first.

import Image from 'next/image'
import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import { LANES, laneOf, type ProjectEntry, shownStars } from '@/lib/projectLanes'
import { css, cx } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import { lineLight } from './lineLight'

const chapterStyles = css`
  position: relative;
  isolation: isolate;
  padding: 11rem 0 13rem;

  &[data-compact='true'] {
    padding: 4.8rem 0 7.2rem;
  }

  @media (max-width: 760px) {
    padding: 6.4rem 0 8rem;

    &[data-compact='true'] {
      padding: 3.2rem 0 5.6rem;
    }
  }
`

const Pool = styled.div`
  position: absolute;
  top: 4%;
  width: 100rem;
  height: 100rem;
  max-width: 120vw;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--pool-a) 0%, var(--pool-b) 38%, transparent 66%);
  filter: blur(30px);
  pointer-events: none;

  &[data-side='right'] {
    right: -14%;
  }
  &[data-side='left'] {
    left: -16%;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(44rem, 100%), 1fr));
  gap: 7.2rem;
  align-items: center;

  @media (max-width: 760px) {
    gap: 4rem;
  }
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  min-width: 0;
`

const Label = styled.p`
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  color: var(--label);
`

const Name = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  font-size: clamp(4.4rem, 1.6rem + 4.8vw, 8.6rem);
  line-height: 0.92;
  letter-spacing: -0.02em;
  color: #f6f2ff;

  & a {
    color: inherit;
    text-decoration: none;
  }
`

const Pitch = styled.p`
  margin: 0;
  font-size: clamp(2.2rem, 1.6rem + 0.9vw, 3rem);
  line-height: 1.25;
  font-weight: 500;
  color: #ffffff;
  text-wrap: balance;
`

const Description = styled.p`
  margin: 0;
  max-width: 52ch;
  font-size: 1.7rem;
  line-height: 1.6;
  font-weight: 300;
  color: #d6cfe6;
  text-wrap: pretty;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.6rem 2.4rem;
  margin-top: 1rem;
`

const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2.6rem;
  border-radius: 999px;
  background: linear-gradient(110deg, var(--cta-a), var(--cta-b));
  color: var(--cta-ink);
  font-weight: 700;
  font-size: 1.6rem;
  text-decoration: none;
  transition:
    transform var(--duration-normal) var(--ease-silk),
    box-shadow var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--cta-ink);
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.4),
      0 18px 50px var(--shot-glow);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

const Secondary = styled(Link)`
  color: #f4f0ff;
  font-size: 1.5rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(244, 240, 255, 0.35);
  padding-bottom: 2px;

  &:hover {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }
`

const shotStyles = css`
  margin: 0;
  --tilt: -11deg;
  transform: perspective(1800px) rotateY(var(--tilt)) rotateX(4deg);
  animation: emission-float 10s ease-in-out infinite alternate;
  will-change: transform;

  &[data-flip='true'] {
    --tilt: 11deg;
  }

  & img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 1.4rem;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.14),
      0 40px 120px var(--shot-glow),
      0 20px 50px rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 760px) {
    transform: none;
    animation: none;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

interface ProductChapterProps {
  entry: ProjectEntry
  /** Screenshot first, tilted the other way, light pooled on the left. */
  flip?: boolean
  /** Load the screenshot eagerly (the first chapter on a page). */
  priority?: boolean
  /** Tighter vertical rhythm, for a chapter that sits under its line's own heading. */
  compact?: boolean
  className?: string
}

export default function ProductChapter({
  entry,
  flip = false,
  priority = false,
  compact = false,
  className,
}: ProductChapterProps) {
  const { project, version } = entry
  const lane = laneOf(project.category)
  const laneLabel = LANES.find((l) => l.id === lane)?.label
  const name = shortName(project.title)
  const page = `/projects/${project.slug}/`
  const pitch = project.pitch ?? tagline(project.title)
  const stars = shownStars(entry.stats?.stars)
  // Under its line's own heading (compact) the line name would repeat, so it drops out.
  const label = [!compact && laneLabel?.toUpperCase(), version && `v${version}`, stars && `★ ${stars}`]
    .filter(Boolean)
    .join(' · ')

  const primary = project.website
    ? { href: project.website, label: `Get ${name} ↗`, rel: 'noopener noreferrer' }
    : project.hasInstall
      ? { href: `${page}#install`, label: `Install ${name}`, rel: undefined }
      : { href: page, label: `Explore ${name}`, rel: undefined }

  const shot = project.screenshot ? (
    <figure className={shotStyles} data-flip={String(flip)}>
      <Image
        alt={project.screenshotAlt ?? `${name} screenshot`}
        height={1000}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 640px"
        src={project.screenshot}
        width={1600}
      />
    </figure>
  ) : null

  return (
    <section
      aria-labelledby={`chapter-${project.slug}`}
      className={cx(chapterStyles, className)}
      data-compact={String(compact)}
      style={lineLight(project.category)}
    >
      <Pool aria-hidden="true" data-side={flip ? 'left' : 'right'} />
      <Grid>
        {flip && shot}
        <Text>
          {label && <Label>{label}</Label>}
          <Name id={`chapter-${project.slug}`}>
            <Link href={page}>{name}</Link>
          </Name>
          {pitch && <Pitch>{pitch}</Pitch>}
          {project.description && <Description>{project.description}</Description>}
          <Actions>
            <Primary href={primary.href} rel={primary.rel}>
              {primary.label}
            </Primary>
            {primary.href !== page && <Secondary href={page}>How it works</Secondary>}
          </Actions>
        </Text>
        {!flip && shot}
      </Grid>
    </section>
  )
}
