import Image from 'next/image'
import Link from 'next/link'
import type { FrontSection, NowData } from '@/lib/content'
import { SOCIAL_LINKS } from '@/lib/socials'
import { styled } from '../../../styled-system/jsx'

export interface ShippingRow {
  slug: string
  title: string
  version: string
  href: string
}

interface RailProps {
  front: FrontSection | null
  now: NowData
  shipping: ShippingRow[]
  projectCount: number
}

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 3.6rem;
`

const Block = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0;
`

const Heading = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--silk-quantum-purple);
  text-shadow: none;
  margin: 0 0 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(162, 89, 255, 0.25);
`

const Photo = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  margin-bottom: 1.6rem;
  border: 1px solid rgba(148, 163, 184, 0.14);

  @media (max-width: 1024px) {
    max-width: 32rem;
  }

  & img {
    object-fit: cover;
    object-position: 50% 20%;
    filter: grayscale(1) contrast(1.06) brightness(0.92);
    transition: filter var(--duration-slower) var(--ease-silk);
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(162, 89, 255, 0.85), rgba(0, 255, 240, 0.5));
    mix-blend-mode: color;
    pointer-events: none;
    transition: opacity var(--duration-slower) var(--ease-silk);
  }
  &:hover img {
    filter: grayscale(0) contrast(1) brightness(1);
  }
  &:hover::after {
    opacity: 0;
  }
`

const Name = styled.p`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.7rem;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--silk-plasma-pink);
  margin: 0;
`

const Role = styled.p`
  font-size: 1.4rem;
  color: var(--text-secondary);
  margin: 0.8rem 0 1.2rem;
`

const Prose = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
  text-wrap: pretty;
`

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1.4rem;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.04em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

const Ship = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1.2rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  font-size: 1.5rem;
  color: var(--text-primary);
  text-decoration: none;

  & span:last-child {
    font-family: var(--font-mono);
    font-size: 1.15rem;
    color: var(--silk-circuit-cyan);
    white-space: nowrap;
    opacity: 0.8;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }
  &:hover span:last-child {
    opacity: 1;
  }
`

export default function Rail({ front, now, shipping, projectCount }: RailProps) {
  return (
    <Aside>
      <Block aria-label="About">
        {front?.photo && (
          <Photo>
            <Image
              alt={front.photoAlt ?? ''}
              fill={true}
              priority={true}
              sizes="(max-width: 1024px) 100vw, 320px"
              src={front.photo}
            />
          </Photo>
        )}
        <Name>Stefanie Jane</Name>
        {front?.role && <Role>{front.role}</Role>}
        {front?.bio && <Prose>{front.bio}</Prose>}
        <Links>
          <Link href="/about/">About →</Link>
          <Link href="/resume/">Resume →</Link>
        </Links>
      </Block>

      {now.focus && (
        <Block>
          <Heading>Now</Heading>
          <Prose>{now.focus}</Prose>
        </Block>
      )}

      {shipping.length > 0 && (
        <Block>
          <Heading>Shipping</Heading>
          <div>
            {shipping.map((row) => (
              <Ship href={row.href} key={row.slug}>
                <span>{row.title}</span>
                <span>v{row.version}</span>
              </Ship>
            ))}
          </div>
          <Links>
            <Link href="/projects/">All {projectCount} projects →</Link>
          </Links>
        </Block>
      )}

      <Block>
        <Heading>Elsewhere</Heading>
        <Links style={{ marginTop: 0 }}>
          {SOCIAL_LINKS.map((social) => (
            <a href={social.href} key={social.href} rel="noopener noreferrer" target="_blank">
              {social.label}
            </a>
          ))}
          <a href="/api/rss">RSS</a>
        </Links>
      </Block>
    </Aside>
  )
}
