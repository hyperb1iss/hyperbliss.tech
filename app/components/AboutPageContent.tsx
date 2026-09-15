// app/components/AboutPageContent.tsx
// About: the person behind the label. Portrait and links in a rail, the story
// in prose beside it, then how to get in touch. Same language as the front
// page rail, with room for the full bio (this is where the CyanogenMod story
// lives).

import Image from 'next/image'
import type { AboutSection } from '@/lib/content'
import { styled } from '../../styled-system/jsx'
import Reveal from './front/Reveal'
import MarkdownRenderer from './MarkdownRenderer'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

interface AboutPageContentProps {
  about: AboutSection
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 32rem minmax(0, 1fr);
  column-gap: 7.2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 4rem;
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

  @media (max-width: 1024px) {
    max-width: 32rem;
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

const Prose = styled.div`
  max-width: 72rem;

  & .markdown-prose__paragraph {
    font-size: 1.7rem;
    line-height: 1.6;
    font-weight: 300;
    letter-spacing: 0;
    color: var(--text-secondary);
    margin-bottom: 1.6rem;
  }
  & .markdown-prose__paragraph strong {
    color: var(--silk-steel-50);
    text-shadow: none;
    font-weight: 500;
  }
  & .markdown-prose__paragraph a,
  & .markdown-prose__link {
    color: var(--silk-circuit-cyan);
    text-shadow: none;
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

const Section = styled.section`
  padding: 0;
  margin-top: 4.8rem;
  max-width: 72rem;
`

const Heading = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-shadow: none;
  color: var(--silk-quantum-purple);
  margin: 0 0 1.6rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(162, 89, 255, 0.25);
`

const Reasons = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 3.2rem;
  margin: 0;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }

  & dt {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.7rem;
    letter-spacing: -0.01em;
    color: #e0aaff;
    margin: 0 0 0.4rem;
  }
  & dd {
    font-size: 1.5rem;
    font-weight: 300;
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
  }
`

const Quiet = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;

  & a {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    letter-spacing: 0.04em;
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    margin-left: 0.8rem;
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

export default function AboutPageContent({ about }: AboutPageContentProps) {
  const { profileImage, profileImageAlt, intro, bio, contactIntro, contactReasons } = about
  const name = intro?.name ?? 'Stefanie Jane'

  return (
    <PageLayout>
      <PageTitle>About</PageTitle>
      <Grid>
        <Reveal as="aside" order={0}>
          {profileImage && (
            <Portrait>
              <Image alt={profileImageAlt ?? name} fill={true} sizes="320px" src={profileImage} />
            </Portrait>
          )}
          <Name>{name}</Name>
          <Role>Creative technologist, Seattle.</Role>
          <Links>
            <a href="https://github.com/hyperb1iss" rel="noopener noreferrer">
              GitHub →
            </a>
            <a href="https://linkedin.com/in/hyperb1iss" rel="noopener noreferrer">
              LinkedIn →
            </a>
            <a href="mailto:stef@hyperbliss.tech">Email →</a>
          </Links>
        </Reveal>

        <Reveal order={1}>
          {intro && (intro.highlightText || intro.introText) && (
            <Lede>
              I&apos;ve been building technology for {intro.highlightText && <strong>{intro.highlightText}</strong>}
              {intro.introText && ` ${intro.introText}`}
            </Lede>
          )}
          {bio && (
            <Prose>
              <MarkdownRenderer content={bio} />
            </Prose>
          )}

          {(contactIntro || (contactReasons && contactReasons.length > 0)) && (
            <Section>
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
          )}

          <Section>
            <Heading>Support</Heading>
            <Quiet>
              If these projects are useful to you, sponsoring keeps the weird and wonderful open source coming.
              <a href="https://github.com/sponsors/hyperb1iss" rel="noopener noreferrer">
                Sponsor on GitHub →
              </a>
            </Quiet>
          </Section>
        </Reveal>
      </Grid>
    </PageLayout>
  )
}
