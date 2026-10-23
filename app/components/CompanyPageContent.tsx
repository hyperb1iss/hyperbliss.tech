// app/components/CompanyPageContent.tsx
// The Company page: who publishes the software. What we make (the flagship
// trio), how we work, and the founder in one paragraph with a link to her
// page, beside a facts rail with the legal name, location, and how to reach us.

import Link from 'next/link'
import type { CompanySection, ProjectSummary } from '@/lib/content'
import { shortName, tagline } from '@/lib/feed'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import MarkdownRenderer from './MarkdownRenderer'
import PageLayout from './PageLayout'
import { Heading, Prose, Reasons, Section } from './PageSections'
import PageTitle from './PageTitle'

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

const More = styled.p`
  margin: 0;
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

interface CompanyPageContentProps {
  company: CompanySection
  products: ProjectSummary[]
}

export default function CompanyPageContent({ company, products }: CompanyPageContentProps) {
  const { lede, principles, founder, contactIntro, contactEmail, legalName, location } = company
  return (
    <PageLayout>
      <PageTitle lede={lede}>Company</PageTitle>
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

          {principles && principles.length > 0 && (
            <Reveal order={1}>
              <Section style={{ maxWidth: 'none' }}>
                <Heading>How we work</Heading>
                <Reasons>
                  {principles.map((principle) => (
                    <div key={principle.title}>
                      <dt>{principle.title}</dt>
                      <dd>{principle.description}</dd>
                    </div>
                  ))}
                </Reasons>
              </Section>
            </Reveal>
          )}

          {founder && (
            <Reveal order={2}>
              <Section>
                <Heading>Founder</Heading>
                <Prose>
                  <MarkdownRenderer content={founder} />
                </Prose>
                <More>
                  <Link href="/about/">Meet Stefanie →</Link>
                </More>
              </Section>
            </Reveal>
          )}
        </Main>

        <Reveal as="aside" order={1}>
          <Facts>
            {legalName && (
              <div>
                <dt>Company</dt>
                <dd>{legalName}</dd>
              </div>
            )}
            {location && (
              <div>
                <dt>Based in</dt>
                <dd>{location}</dd>
              </div>
            )}
            <div>
              <dt>Founder</dt>
              <dd>
                <Link href="/about/">Stefanie Jane</Link>
              </dd>
            </div>
            {contactEmail && (
              <div>
                <dt>Contact</dt>
                <dd>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  {contactIntro && <small>{contactIntro}</small>}
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
