// A product line's flagship as a wide panel: name, promise, and a primary
// call to action beside a framed screenshot of the real product. The primary
// action goes to the product's own site when it has one, otherwise to the
// install section of its page here. Without a screenshot the panel is text
// only.

import Image from 'next/image'
import Link from 'next/link'
import { shortName, tagline } from '@/lib/feed'
import type { ProjectEntry } from '@/lib/projectLanes'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import { neonTitle } from '../front/neon'
import Reveal from '../front/Reveal'
import ProjectIcon from './ProjectIcon'
import ProjectMeta from './ProjectMeta'

const panelStyles = css`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 4.8rem;
  align-items: center;
  padding: 3.2rem 0 3.6rem;

  &[data-kind='text'] {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.8rem;
  }
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  min-width: 0;
`

const Name = styled.h3`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.2rem, 2.6rem + 1.4vw, 4.4rem);
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: none;
  text-shadow: none;
  margin: 0.4rem 0 0;

  & a {
    color: inherit;
    text-decoration: none;
  }
`

const Tagline = styled.p`
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--silk-steel-50);
  margin: 0;
  text-wrap: balance;
`

const Description = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
  max-width: 52rem;
  text-wrap: pretty;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem 2.4rem;
  margin: 0.8rem 0 0.4rem;
`

const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.2rem;
  border-radius: 6px;
  background: linear-gradient(110deg, var(--silk-quantum-purple) 0%, var(--silk-circuit-cyan) 100%);
  color: #0a0a14;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: 0 0 0 1px rgba(0, 255, 240, 0.2), 0 10px 30px rgba(162, 89, 255, 0.25);
  transition:
    box-shadow var(--duration-normal) var(--ease-silk),
    transform var(--duration-normal) var(--ease-silk);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(0, 255, 240, 0.45), 0 14px 38px rgba(0, 255, 240, 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

const Secondary = styled.span`
  font-family: var(--font-mono);
  font-size: 1.25rem;
  letter-spacing: 0.04em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

const Shot = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(162, 89, 255, 0.3);
  background: #05050c;
  box-shadow:
    0 0 0 1px rgba(0, 255, 240, 0.06),
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 0 70px rgba(162, 89, 255, 0.16);

  & img {
    object-fit: cover;
    object-position: top left;
  }
`

interface FlagshipProps {
  entry: ProjectEntry
  now: number
  order?: number
  /** True for the first flagship on the page, so its screenshot loads eagerly. */
  priority?: boolean
}

export default function Flagship({ entry, now, order = 0, priority = false }: FlagshipProps) {
  const { project } = entry
  const name = shortName(project.title)
  const sub = tagline(project.title)
  const page = `/projects/${project.slug}/`
  const primaryHref = project.website ?? (project.hasInstall ? `${page}#install` : page)
  const primaryLabel = project.website || project.hasInstall ? `Get ${name}` : `Explore ${name}`
  const hasShot = Boolean(project.screenshot)

  return (
    <Reveal as="article" className={panelStyles} data-kind={hasShot ? 'shot' : 'text'} order={order}>
      <Text>
        <ProjectIcon size={28} slug={project.slug} />
        <Name className={neonTitle}>
          <Link href={page}>{name}</Link>
        </Name>
        {sub && <Tagline>{sub}</Tagline>}
        {project.description && <Description>{project.description}</Description>}
        <Actions>
          <Primary href={primaryHref} rel={project.website ? 'noopener noreferrer' : undefined}>
            {primaryLabel} {project.website ? '↗' : '→'}
          </Primary>
          {primaryHref !== page && (
            <Secondary>
              <Link href={page}>Product page →</Link>
            </Secondary>
          )}
        </Actions>
        <ProjectMeta entry={entry} now={now} />
      </Text>
      {project.screenshot && (
        <Shot>
          <Image
            alt={project.screenshotAlt ?? `${name} screenshot`}
            fill={true}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 720px"
            src={project.screenshot}
          />
        </Shot>
      )}
    </Reveal>
  )
}
