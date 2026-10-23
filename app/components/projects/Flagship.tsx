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
import { displayInk } from '../front/neon'
import Reveal from '../front/Reveal'
import { PrimaryAction, ProductShot, SecondaryAction } from './ProductParts'
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
        <Name className={displayInk}>
          <Link href={page}>{name}</Link>
        </Name>
        {sub && <Tagline>{sub}</Tagline>}
        {project.description && <Description>{project.description}</Description>}
        <Actions>
          <PrimaryAction href={primaryHref} rel={project.website ? 'noopener noreferrer' : undefined}>
            {primaryLabel} {project.website ? '↗' : '→'}
          </PrimaryAction>
          {primaryHref !== page && (
            <SecondaryAction>
              <Link href={page}>Product page →</Link>
            </SecondaryAction>
          )}
        </Actions>
        <ProjectMeta entry={entry} now={now} />
      </Text>
      {project.screenshot && (
        <ProductShot>
          <Image
            alt={project.screenshotAlt ?? `${name} screenshot`}
            fill={true}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 720px"
            src={project.screenshot}
          />
        </ProductShot>
      )}
    </Reveal>
  )
}
