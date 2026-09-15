// app/components/ResumePageContent.tsx
'use client'

import { motion } from 'framer-motion'
import React, { useMemo } from 'react'
import {
  FiAward,
  FiBriefcase,
  FiCode,
  FiDownload,
  FiGithub,
  FiGlobe,
  FiHeart,
  FiLink,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { parseResume } from '../lib/resumeParser'
import Reveal from './front/Reveal'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

// ═══════════════════════════════════════════════════════════════════════════
// Motion component styles (using css function)
// ═══════════════════════════════════════════════════════════════════════════

const resumeWrapperStyles = css`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "contact" "content" "skills";
  gap: var(--space-10);

  @media (min-width: 1024px) {
    grid-template-columns: 350px minmax(0, 1fr);
    grid-template-areas: "contact content" "skills content";
    grid-template-rows: auto 1fr;
    gap: var(--space-6) var(--space-12);
  }
`

const contactCardStyles = css`
  grid-area: contact;
  align-self: start;
`

const skillsCardStyles = css`
  grid-area: skills;
  align-self: start;
`

const mainContentStyles = css`
  grid-area: content;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
`

/* Sections read as rows under a hairline, like every other page, instead
   of glass cards. */
const contentSectionStyles = css`
  padding-top: var(--space-8);
  border-top: 1px solid rgba(162, 89, 255, 0.25);
`

const downloadButtonStyles = css`
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.9),
    rgba(255, 117, 216, 0.9)
  );
  backdrop-filter: blur(10px);
  border: 2px solid var(--silk-plasma-pink);
  border-radius: var(--radius-full);
  color: var(--silk-white);
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: var(--font-semibold);
  text-decoration: none;
  box-shadow:
    0 0 30px rgba(255, 117, 216, 0.5),
    0 10px 40px rgba(139, 92, 246, 0.3);
  transition: all var(--duration-normal) var(--ease-silk);
  /* Above the footer (1100) so the button stays reachable at the page end. */
  z-index: 1200;

  svg {
    font-size: 2rem;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    background: linear-gradient(
      135deg,
      rgba(162, 89, 255, 1),
      rgba(255, 117, 216, 1)
    );
    border-color: var(--silk-quantum-purple);
    box-shadow:
      0 0 25px rgba(162, 89, 255, 0.5),
      0 15px 40px rgba(255, 117, 216, 0.35);
  }

  @media (max-width: 768px) {
    bottom: var(--space-6);
    right: var(--space-6);
    padding: var(--space-3) var(--space-5);
    font-size: 1.4rem;
  }
`

// ═══════════════════════════════════════════════════════════════════════════
// Static Panda CSS styles
// ═══════════════════════════════════════════════════════════════════════════

const ContactTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--silk-quantum-purple);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: none;
  margin-bottom: var(--space-5);
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(162, 89, 255, 0.25);
  position: relative;
  z-index: 1;
`

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1-5) 0;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-silk);

  svg {
    font-size: 1.6rem;
    opacity: 0.8;
  }

  &:hover {
    color: var(--silk-plasma-pink);
  }
`

const SkillCategory = styled.div`
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;

  &:last-child {
    margin-bottom: 0;
  }
`

const SkillLabel = styled.h3`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: var(--font-semibold);
  color: var(--silk-circuit-cyan);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-3);
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
`

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
`

const SkillTag = styled.a`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--silk-lavender);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-silk);

  /* Multi-word skills ("Android OS") need more than a gap to read as one item. */
  & + &::before {
    content: '·';
    margin-right: var(--space-3);
    color: var(--silk-quantum-purple);
    opacity: 0.7;
  }

  &[href]:hover {
    color: var(--silk-circuit-cyan);
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
`

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
    color: var(--silk-circuit-cyan);
    opacity: 0.85;
  }
`

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: none;
  color: var(--silk-circuit-cyan);
  text-shadow: 0 0 16px rgba(0, 255, 240, 0.25);
  margin: 0;
`

const TimelineItem = styled.div`
  position: relative;
  padding-left: var(--space-10);
  margin-bottom: var(--space-8);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 28px;
    bottom: -32px;
    width: 2px;
    background: linear-gradient(
      180deg,
      var(--silk-circuit-cyan),
      transparent
    );
    opacity: 0.3;
  }

  &:last-child::before {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 8px;
    top: 8px;
    width: 10px;
    height: 10px;
    background: var(--silk-circuit-cyan);
    border: 2px solid var(--silk-quantum-purple);
    border-radius: var(--radius-full);
  }
`

const SubLabel = styled.h3`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-shadow: none;
  color: var(--silk-quantum-purple);
  margin: 0 0 var(--space-3);
`

const TimelineHeader = styled.div`
  margin-bottom: var(--space-3);
`

const CompanyName = styled.h3`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  color: #e0aaff;
  margin-bottom: var(--space-1);

  a {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-silk);

    &:hover {
      color: var(--silk-circuit-cyan);
    }
  }
`

const JobTitle = styled.h4`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  font-weight: var(--font-semibold);
  color: var(--silk-lavender);
  margin-bottom: var(--space-1);
`

const TimelineMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--silk-circuit-cyan);
  opacity: 0.8;
  margin-bottom: var(--space-3);
  text-shadow: 0 0 6px rgba(0, 255, 240, 0.3);
`

const TimelineContent = styled.div`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);

  ul {
    list-style: none;
    padding: 0;
    margin: var(--space-2) 0;
  }

  li {
    position: relative;
    padding-left: var(--space-6);
    margin-bottom: var(--space-2);

    &::before {
      content: '\u25B8';
      position: absolute;
      left: 0;
      color: var(--silk-circuit-cyan);
      text-shadow: 0 0 8px rgba(0, 255, 240, 0.5);
    }
  }

  strong {
    color: var(--silk-lavender);
    font-weight: var(--font-semibold);
  }

  a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all var(--duration-fast) var(--ease-silk);

    &:hover {
      color: var(--silk-plasma-pink);
      border-bottom-color: var(--silk-plasma-pink);
      text-shadow: 0 0 6px rgba(255, 117, 216, 0.4);
    }
  }

  p {
    margin: 0 0 var(--space-2) 0;
  }
`

// ═══════════════════════════════════════════════════════════════════════════
// Helper Components
// ═══════════════════════════════════════════════════════════════════════════

// Helper component to render markdown content with links
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--silk-plasma-pink)'
              e.currentTarget.style.borderBottomColor = 'var(--silk-plasma-pink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--silk-circuit-cyan)'
              e.currentTarget.style.borderBottomColor = 'transparent'
            }}
            rel="noopener noreferrer"
            style={{
              borderBottom: '1px solid transparent',
              color: 'var(--silk-circuit-cyan)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            target="_blank"
          >
            {children}
          </a>
        ),
        p: ({ children }) => <span>{children}</span>,
        strong: ({ children }) => <strong style={{ color: 'var(--silk-lavender)' }}>{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

const ResumePageContent: React.FC<{ content: string }> = ({ content }) => {
  // Parse the resume markdown
  const resumeData = useMemo(() => parseResume(content), [content])

  const { name, tagline, contact, summary, skills, experience, projects, speaking, awards, interests } = resumeData

  // Filter out empty skill categories
  const displaySkills = Object.entries(skills).filter(([_, items]) => items.length > 0)

  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>

      <div className={resumeWrapperStyles}>
        <Reveal className={contactCardStyles} order={0}>
          <ContactTitle>{name || 'Connect'}</ContactTitle>
          {contact.email && (
            <ContactItem href={`mailto:${contact.email}`}>
              <FiMail />
              <span>{contact.email}</span>
            </ContactItem>
          )}
          {contact.github && (
            <ContactItem href={contact.github} rel="noopener noreferrer" target="_blank">
              <FiGithub />
              <span>{contact.github.replace('https://github.com/', '')}</span>
            </ContactItem>
          )}
          {contact.linkedin && (
            <ContactItem href={contact.linkedin} rel="noopener noreferrer" target="_blank">
              <FiLinkedin />
              <span>{contact.linkedin.replace('https://www.linkedin.com/in/', '')}</span>
            </ContactItem>
          )}
          {contact.website && (
            <ContactItem href={contact.website} rel="noopener noreferrer" target="_blank">
              <FiGlobe />
              <span>{contact.website.replace(/https?:\/\/(www\.)?/, '')}</span>
            </ContactItem>
          )}
          {contact.links && (
            <ContactItem href={contact.links} rel="noopener noreferrer" target="_blank">
              <FiLink />
              <span>Links</span>
            </ContactItem>
          )}
        </Reveal>

        <div className={mainContentStyles}>
          {summary && (
            <Reveal className={contentSectionStyles} order={3}>
              <SectionHeader>
                <SectionIcon>
                  <FiAward />
                </SectionIcon>
                <SectionTitle>Summary</SectionTitle>
              </SectionHeader>
              <TimelineContent>
                {tagline && (
                  <p style={{ color: 'var(--silk-plasma-pink)', fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>
                    {tagline}
                  </p>
                )}
                {summary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={idx > 0 ? { marginTop: 'var(--space-4)' } : undefined}>
                    {paragraph}
                  </p>
                ))}
              </TimelineContent>
            </Reveal>
          )}

          <Reveal className={contentSectionStyles} order={4}>
            <SectionHeader>
              <SectionIcon>
                <FiBriefcase />
              </SectionIcon>
              <SectionTitle>Experience</SectionTitle>
            </SectionHeader>

            {experience.map((job, index) => (
              <TimelineItem key={index}>
                <TimelineHeader>
                  <CompanyName>
                    {job.companyUrl ? (
                      <a
                        href={job.companyUrl}
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        target="_blank"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </CompanyName>
                  <JobTitle>{job.position}</JobTitle>
                  <TimelineMeta>{job.period}</TimelineMeta>
                </TimelineHeader>
                <TimelineContent>
                  {job.bullets.length > 0 && (
                    <ul>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx}>
                          <MarkdownContent content={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.technologies.length > 0 && (
                    <div style={{ marginTop: 'var(--space-3)' }}>
                      <strong style={{ color: 'var(--silk-circuit-cyan)' }}>Technologies:</strong>{' '}
                      {job.technologies.map((tech, idx) => (
                        <React.Fragment key={idx}>
                          {tech.url ? (
                            <a
                              href={tech.url}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--silk-circuit-cyan)'
                                e.currentTarget.style.borderBottomColor = 'var(--silk-circuit-cyan)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--silk-lavender)'
                                e.currentTarget.style.borderBottomColor = 'transparent'
                              }}
                              rel="noopener noreferrer"
                              style={{
                                borderBottom: '1px solid transparent',
                                color: 'var(--silk-lavender)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                              target="_blank"
                            >
                              {tech.name}
                            </a>
                          ) : (
                            <span>{tech.name}</span>
                          )}
                          {idx < job.technologies.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Reveal>

          {projects.length > 0 && (
            <Reveal className={contentSectionStyles} order={5}>
              <SectionHeader>
                <SectionIcon>
                  <FiCode />
                </SectionIcon>
                <SectionTitle>Open Source Projects</SectionTitle>
              </SectionHeader>

              <TimelineContent>
                {projects.map((project, index) => (
                  <TimelineItem key={index}>
                    <TimelineHeader>
                      <CompanyName>
                        {project.url ? (
                          <a
                            href={project.url}
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            target="_blank"
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                      </CompanyName>
                    </TimelineHeader>
                    <TimelineContent>
                      <p>
                        <MarkdownContent content={project.description} />
                      </p>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </TimelineContent>
            </Reveal>
          )}

          {(speaking.length > 0 || awards.length > 0) && (
            <Reveal className={contentSectionStyles} order={6}>
              <SectionHeader>
                <SectionIcon>
                  <FiAward />
                </SectionIcon>
                <SectionTitle>Recognition & Achievements</SectionTitle>
              </SectionHeader>

              <TimelineContent>
                {speaking.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <SubLabel>Speaking & Recognition</SubLabel>
                    <ul>
                      {speaking.map((item, idx) => (
                        <li key={idx}>
                          <MarkdownContent content={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {awards.length > 0 && (
                  <div>
                    <SubLabel>Awards</SubLabel>
                    <ul>
                      {awards.map((item, idx) => (
                        <li key={idx}>
                          <MarkdownContent content={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TimelineContent>
            </Reveal>
          )}

          {interests.length > 0 && (
            <Reveal className={contentSectionStyles} order={7}>
              <SectionHeader>
                <SectionIcon>
                  <FiHeart />
                </SectionIcon>
                <SectionTitle>Personal Interests</SectionTitle>
              </SectionHeader>

              <TimelineContent>
                <ul>
                  {interests.map((item, idx) => (
                    <li key={idx}>
                      <MarkdownContent content={item} />
                    </li>
                  ))}
                </ul>
              </TimelineContent>
            </Reveal>
          )}
        </div>
        <Reveal className={skillsCardStyles} order={1}>
          <ContactTitle>Skills</ContactTitle>
          {displaySkills.map(([category, items]) => (
            <SkillCategory key={category}>
              <SkillLabel>{category}</SkillLabel>
              <SkillTags>
                {items.map((skill, idx) => (
                  <SkillTag
                    as={skill.url ? 'a' : 'span'}
                    href={skill.url}
                    key={idx}
                    rel={skill.url ? 'noopener noreferrer' : undefined}
                    target={skill.url ? '_blank' : undefined}
                  >
                    {skill.name}
                  </SkillTag>
                ))}
              </SkillTags>
            </SkillCategory>
          ))}
        </Reveal>
      </div>

      <motion.a
        className={downloadButtonStyles}
        download={true}
        href="/resume.pdf"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiDownload />
        <span>Download PDF</span>
      </motion.a>
    </PageLayout>
  )
}

export default ResumePageContent
