// app/components/AboutPageContent.tsx
// About: the company first (what we make, how we work), then the founder with
// her portrait, story, and links (the resume lives here, not in the nav), then
// how to get in touch, beside a facts rail with the legal name, location, and
// contact. This is where the full CyanogenMod story lives.

import Image from 'next/image'
import Link from 'next/link'
import type { AboutSection, CompanySection, ProjectSummary } from '@/lib/content'
import { shortName, tagline } from '@/lib/feed'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import MarkdownRenderer from './MarkdownRenderer'
import PageLayout from './PageLayout'
import { Heading, Prose, Quiet, Reasons, Section } from './PageSections'
import PageTitle from './PageTitle'

interface AboutPageContentProps {
  about: AboutSection
  company: CompanySection | null
  products: ProjectSummary[]
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30rem;
  column-gap: 7.2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 4.8rem;
  }
`

const Main = styled.div`
  min-width: 0;
  max-width: 96rem;
`

const Products = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.4rem 3.2rem;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }

  & li {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
`

const ProductName = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.2rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  margin: 0;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

const ProductTagline = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--silk-steel-50);
  margin: 0;
`

const ProductBlurb = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  text-wrap: pretty;
`

const Founder = styled.div`
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
  column-gap: 4.8rem;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 2.8rem;
  }
`

const Portrait = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  margin-bottom: 1.6rem;
  border: 1px solid rgba(148, 163, 184, 0.14);

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

  @media (max-width: 760px) {
    max-width: 24rem;
  }
`

const Name = styled.p`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.4rem;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--silk-plasma-pink);
  margin: 0;
`

const Role = styled.p`
  font-size: 1.4rem;
  color: var(--text-secondary);
  margin: 0.8rem 0 1.4rem;
`

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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

const Lede = styled.p`
  font-size: 2.1rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--silk-steel-50);
  margin: 0 0 2rem;
  max-width: 72rem;
  text-wrap: pretty;

  & strong {
    font-weight: 500;
    color: var(--silk-circuit-cyan);
  }
`

// The rail sits beside the sections, so its first label lines up with theirs.
const Facts = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  & dt {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--silk-quantum-purple);
    margin: 0 0 0.4rem;
  }
  & dd {
    margin: 0;
    font-size: 1.5rem;
    line-height: 1.45;
    color: var(--silk-steel-50);
  }
  & dd small {
    display: block;
    margin-top: 0.4rem;
    font-size: 1.3rem;
    font-weight: 300;
    color: var(--text-secondary);
  }
  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

export default function AboutPageContent({ about, company, products }: AboutPageContentProps) {
  const { profileImage, profileImageAlt, intro, bio, contactIntro, contactReasons } = about
  const name = intro?.name ?? 'Stefanie Jane'
  return (
    <PageLayout>
      <PageTitle lede={company?.lede}>About</PageTitle>
      <Grid>
        <Main>
          {products.length > 0 && (
            <Reveal order={0}>
              <Section style={{ marginTop: 0, maxWidth: 'none' }}>
                <Heading>What we make</Heading>
                <Products>
                  {products.map((project) => (
                    <li key={project.slug}>
                      <ProductName>
                        <Link href={`/projects/${project.slug}/`}>{shortName(project.title)}</Link>
                      </ProductName>
                      {tagline(project.title) && <ProductTagline>{tagline(project.title)}</ProductTagline>}
                      {project.description && <ProductBlurb>{project.description}</ProductBlurb>}
                    </li>
                  ))}
                </Products>
              </Section>
            </Reveal>
          )}

          {company?.principles && company.principles.length > 0 && (
            <Reveal order={1}>
              <Section style={{ maxWidth: 'none' }}>
                <Heading>How we work</Heading>
                <Reasons>
                  {company.principles.map((principle) => (
                    <div key={principle.title}>
                      <dt>{principle.title}</dt>
                      <dd>{principle.description}</dd>
                    </div>
                  ))}
                </Reasons>
              </Section>
            </Reveal>
          )}

          <Reveal order={2}>
            <Section id="founder" style={{ maxWidth: 'none', scrollMarginTop: '14rem' }}>
              <Heading>Founder</Heading>
              <Founder>
                <div>
                  {profileImage && (
                    <Portrait>
                      <Image alt={profileImageAlt ?? name} fill={true} sizes="220px" src={profileImage} />
                    </Portrait>
                  )}
                  <Name>{name}</Name>
                  <Role>Founder, Seattle.</Role>
                  <Links>
                    <a href="https://github.com/hyperb1iss" rel="noopener noreferrer">
                      GitHub →
                    </a>
                    <a href="https://linkedin.com/in/hyperb1iss" rel="noopener noreferrer">
                      LinkedIn →
                    </a>
                    <a href="https://instagram.com/hyperb1iss" rel="noopener noreferrer">
                      Instagram →
                    </a>
                    <a href="https://open.spotify.com/user/12173574470" rel="noopener noreferrer">
                      Spotify →
                    </a>
                    <Link href="/resume/">Resume →</Link>
                  </Links>
                </div>
                <div>
                  {intro && (intro.highlightText || intro.introText) && (
                    <Lede>
                      I&apos;ve been building technology for{' '}
                      {intro.highlightText && <strong>{intro.highlightText}</strong>}
                      {intro.introText && ` ${intro.introText}`}
                    </Lede>
                  )}
                  {bio && (
                    <Prose>
                      <MarkdownRenderer content={bio} />
                    </Prose>
                  )}
                </div>
              </Founder>
            </Section>
          </Reveal>

          {(contactIntro || (contactReasons && contactReasons.length > 0)) && (
            <Reveal order={3}>
              <Section style={{ maxWidth: 'none' }}>
                <Heading>Say hi</Heading>
                {contactIntro && <Quiet style={{ marginBottom: '2rem' }}>{contactIntro}</Quiet>}
                {contactReasons && contactReasons.length > 0 && (
                  <Reasons>
                    {contactReasons.map((reason) => (
                      <div key={reason.title}>
                        <dt>{reason.title}</dt>
                        <dd>{reason.description}</dd>
                      </div>
                    ))}
                  </Reasons>
                )}
              </Section>
            </Reveal>
          )}
        </Main>

        <Reveal as="aside" order={1}>
          <Facts>
            {company?.legalName && (
              <div>
                <dt>Company</dt>
                <dd>{company.legalName}</dd>
              </div>
            )}
            {company?.location && (
              <div>
                <dt>Based in</dt>
                <dd>{company.location}</dd>
              </div>
            )}
            <div>
              <dt>Founder</dt>
              <dd>
                <a href="#founder">{name}</a>
              </dd>
            </div>
            {company?.contactEmail && (
              <div>
                <dt>Contact</dt>
                <dd>
                  <a href={`mailto:${company.contactEmail}`}>{company.contactEmail}</a>
                  {company.contactIntro && <small>{company.contactIntro}</small>}
                </dd>
              </div>
            )}
            <div>
              <dt>Source</dt>
              <dd>
                <a href="https://github.com/hyperb1iss" rel="noopener noreferrer">
                  github.com/hyperb1iss
                </a>
              </dd>
            </div>
            <div>
              <dt>Support</dt>
              <dd>
                <a href="https://github.com/sponsors/hyperb1iss" rel="noopener noreferrer">
                  GitHub Sponsors →
                </a>
                <small>If our tools are useful to you, sponsorship keeps them coming.</small>
              </dd>
            </div>
          </Facts>
        </Reveal>
      </Grid>
    </PageLayout>
  )
}
