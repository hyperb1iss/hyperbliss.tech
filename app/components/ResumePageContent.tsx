// app/components/ResumePageContent.tsx
'use client'

import { motion } from 'framer-motion'
import React, { useMemo } from 'react'
import { FiAward, FiBriefcase, FiCode, FiDownload, FiGithub, FiGlobe, FiLink, FiLinkedin, FiMail } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import styled, { keyframes } from 'styled-components'
import { parseResume } from '../lib/resumeParser'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

// Animations
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

const glow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
`

// Main container
const ResumeWrapper = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  
  @media (min-width: 1024px) {
    grid-template-columns: 350px 1fr;
    gap: var(--space-12);
  }
`

// Left sidebar
const Sidebar = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`

const ContactCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(30, 41, 59, 0.6) 40%,
    rgba(0, 255, 240, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(1.2);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.2),
    0 0 50px rgba(0, 255, 240, 0.1),
    inset 0 0 20px rgba(224, 170, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      #8b5cf6,
      #00fff0,
      #ff75d8,
      #e0aaff
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    animation: ${glow} 3s ease-in-out infinite;
  }
`

const ContactTitle = styled.h3`
  font-family: 'Audiowide', var(--font-display);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-bold);
  background: linear-gradient(
    90deg,
    #ff75d8 0%,
    #00fff0 50%,
    #ff75d8 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(255, 117, 216, 0.4));
`

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.05),
    rgba(0, 255, 240, 0.02)
  );
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-silk);
  position: relative;
  z-index: 1;
  
  svg {
    color: var(--silk-circuit-cyan);
    font-size: 1.8rem;
    filter: drop-shadow(0 0 6px rgba(0, 255, 240, 0.4));
  }
  
  span {
    font-family: var(--font-body);
    font-size: 1.5rem;
  }
  
  &:hover {
    transform: translateX(5px);
    border-color: var(--silk-circuit-cyan);
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.1),
      rgba(139, 92, 246, 0.05)
    );
    color: var(--silk-lavender);
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.3);
    
    svg {
      color: var(--silk-plasma-pink);
      filter: drop-shadow(0 0 10px rgba(255, 117, 216, 0.6));
    }
  }
`

const SkillsCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.6) 0%,
    rgba(217, 70, 239, 0.05) 100%
  );
  backdrop-filter: blur(15px) saturate(1.1);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 25px rgba(217, 70, 239, 0.15),
    inset 0 0 20px rgba(139, 92, 246, 0.03);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(217, 70, 239, 0.4),
      transparent,
      rgba(139, 92, 246, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.4;
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

const SkillLabel = styled.h4`
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
  gap: var(--space-2);
`

const SkillTag = styled.a`
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  padding: var(--space-1) var(--space-2-5);
  background: linear-gradient(
    135deg,
    rgba(255, 117, 216, 0.1),
    rgba(224, 170, 255, 0.08)
  );
  border: 1px solid rgba(255, 117, 216, 0.25);
  border-radius: var(--radius-full);
  font-size: 1.2rem;
  color: var(--silk-lavender);
  transition: all var(--duration-fast) var(--ease-silk);
  
  &:hover {
    transform: translateY(-2px);
    border-color: var(--silk-circuit-cyan);
    color: var(--silk-circuit-cyan);
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.15),
      rgba(139, 92, 246, 0.1)
    );
    text-shadow: 0 0 6px rgba(0, 255, 240, 0.5);
  }
`

// Main content area
const MainContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
`

const ContentSection = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(162, 89, 255, 0.06) 0%,
    rgba(30, 41, 59, 0.5) 50%,
    rgba(0, 255, 240, 0.04) 100%
  );
  backdrop-filter: blur(20px) saturate(1.15);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(162, 89, 255, 0.15),
    0 0 50px rgba(0, 255, 240, 0.08),
    inset 0 0 25px rgba(139, 92, 246, 0.04);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(162, 89, 255, 0.3),
      transparent 40%,
      rgba(0, 255, 240, 0.3)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.03),
      transparent
    );
    animation: ${shimmer} 8s infinite;
    pointer-events: none;
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
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2),
    rgba(0, 255, 240, 0.1)
  );
  border: 2px solid var(--silk-circuit-cyan);
  border-radius: var(--radius-lg);

  svg {
    font-size: 2.4rem;
    color: var(--silk-circuit-cyan);
    filter: drop-shadow(0 0 10px rgba(0, 255, 240, 0.6));
  }
`

const SectionTitle = styled.h2`
  font-family: 'Audiowide', var(--font-display);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-bold);
  background: linear-gradient(
    90deg,
    #ff75d8 0%,
    #e0aaff 50%,
    #ff75d8 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  filter: drop-shadow(0 0 12px rgba(255, 117, 216, 0.4));
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
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.6);
  }
`

const TimelineHeader = styled.div`
  margin-bottom: var(--space-3);
`

const CompanyName = styled.h3`
  font-family: var(--font-display);
  font-size: var(--text-fluid-lg);
  font-weight: var(--font-bold);
  color: var(--silk-plasma-pink);
  margin-bottom: var(--space-1);
  text-shadow: 0 0 10px rgba(255, 117, 216, 0.4);
  
  a {
    color: inherit;
    text-decoration: none;
    transition: all var(--duration-fast) var(--ease-silk);
    
    &:hover {
      color: var(--silk-circuit-cyan);
      text-shadow: 0 0 15px rgba(0, 255, 240, 0.6);
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
      content: '▸';
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

// Download button
const DownloadButton = styled(motion.a)`
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
  z-index: 100;
  
  svg {
    font-size: 2rem;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    background: linear-gradient(
      135deg,
      rgba(255, 117, 216, 0.9),
      rgba(0, 255, 240, 0.9)
    );
    border-color: var(--silk-circuit-cyan);
    box-shadow: 
      0 0 40px rgba(0, 255, 240, 0.6),
      0 15px 50px rgba(255, 117, 216, 0.4);
  }
  
  @media (max-width: 768px) {
    bottom: var(--space-6);
    right: var(--space-6);
    padding: var(--space-3) var(--space-5);
    font-size: 1.4rem;
  }
`

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

// Component
const ResumePageContent: React.FC<{ content: string }> = ({ content }) => {
  // Parse the resume markdown
  const resumeData = useMemo(() => parseResume(content), [content])

  const { name, tagline, contact, summary, skills, experience, projects, speaking, awards } = resumeData

  // Filter out empty skill categories
  const displaySkills = Object.entries(skills).filter(([_, items]) => items.length > 0)

  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>

      <ResumeWrapper>
        <Sidebar>
          <ContactCard
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
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
          </ContactCard>

          <SkillsCard
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <ContactTitle>Skills</ContactTitle>
            {displaySkills.map(([category, items]) => (
              <SkillCategory key={category}>
                <SkillLabel>{category}</SkillLabel>
                <SkillTags>
                  {items.slice(0, 8).map((skill, idx) => (
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
          </SkillsCard>
        </Sidebar>

        <MainContent>
          {summary && (
            <ContentSection
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
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
            </ContentSection>
          )}

          <ContentSection
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <SectionHeader>
              <SectionIcon>
                <FiBriefcase />
              </SectionIcon>
              <SectionTitle>Experience</SectionTitle>
            </SectionHeader>

            {experience.slice(0, 6).map((job, index) => (
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
          </ContentSection>

          {projects.length > 0 && (
            <ContentSection
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <SectionHeader>
                <SectionIcon>
                  <FiCode />
                </SectionIcon>
                <SectionTitle>Open Source Projects</SectionTitle>
              </SectionHeader>

              <TimelineContent>
                {projects.slice(0, 5).map((project, index) => (
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
            </ContentSection>
          )}

          {(speaking.length > 0 || awards.length > 0) && (
            <ContentSection
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <SectionHeader>
                <SectionIcon>
                  <FiAward />
                </SectionIcon>
                <SectionTitle>Recognition & Achievements</SectionTitle>
              </SectionHeader>

              <TimelineContent>
                {speaking.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ color: 'var(--silk-plasma-pink)', marginBottom: 'var(--space-3)' }}>
                      Speaking & Recognition
                    </h4>
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
                    <h4 style={{ color: 'var(--silk-plasma-pink)', marginBottom: 'var(--space-3)' }}>Awards</h4>
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
            </ContentSection>
          )}
        </MainContent>
      </ResumeWrapper>

      <DownloadButton download={true} href="/resume.pdf" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <FiDownload />
        <span>Download PDF</span>
      </DownloadButton>
    </PageLayout>
  )
}

export default ResumePageContent
