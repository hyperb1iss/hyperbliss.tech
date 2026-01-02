'use client'

// app/components/AboutPageContent.tsx
// Two-column grid layout with profile card and bio content

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { FaCode, FaEnvelope, FaGithub, FaLinkedin, FaMicrochip, FaRocket } from 'react-icons/fa6'
import styled, { keyframes } from 'styled-components'
import type { AboutSection } from '@/lib/tina'
import defaultProfileImage from '../../public/images/profile-image.jpg'
import MarkdownRenderer from './MarkdownRenderer'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import { SparklingName } from './SparklingName'

interface AboutPageContentProps {
  about: AboutSection
}

// ═══════════════════════════════════════════════════════════════════════════
// Animations
// ═══════════════════════════════════════════════════════════════════════════

const _gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`

// ═══════════════════════════════════════════════════════════════════════════
// Layout Components
// ═══════════════════════════════════════════════════════════════════════════

const ContentGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    grid-template-columns: 380px 1fr;
    gap: var(--space-12);
  }
`

const ProfileSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`

const ProfileCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(162, 89, 255, 0.08) 0%,
    rgba(30, 41, 59, 0.6) 50%,
    rgba(255, 117, 216, 0.08) 100%
  );
  backdrop-filter: blur(20px) saturate(1.2);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  position: relative;
  overflow: visible;
  box-shadow:
    0 0 25px rgba(162, 89, 255, 0.2),
    0 0 40px rgba(255, 117, 216, 0.1),
    inset 0 0 20px rgba(139, 92, 246, 0.05);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      #a855f7,
      #00fff0,
      #ff75d8
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }
`

const ProfileImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 2792 / 4083;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  overflow: hidden;
  filter: saturate(1.1) brightness(1.05);
  position: relative;
  z-index: 1;

  img {
    transition: transform var(--duration-normal) var(--ease-silk);
    will-change: transform;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

const ProfileImage = styled(Image)`
  object-fit: cover;
`

const ProfileName = styled.h2`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-2xl);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-2);
  position: relative;
  z-index: 1;
`

const ProfileTitle = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--silk-circuit-cyan);
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
`

const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  position: relative;
  z-index: 1;
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(0, 255, 240, 0.05)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: var(--radius-full);
  color: var(--silk-lavender);
  font-size: 1.8rem;
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    transform: translateY(-3px) scale(1.1);
    border-color: var(--silk-circuit-cyan);
    color: var(--silk-circuit-cyan);
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.15),
      rgba(139, 92, 246, 0.1)
    );
  }
`

const ContentSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
`

const BioCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.06) 0%,
    rgba(30, 41, 59, 0.5) 50%,
    rgba(0, 255, 240, 0.04) 100%
  );
  backdrop-filter: blur(20px) saturate(1.1);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 20px rgba(139, 92, 246, 0.15),
    inset 0 0 20px rgba(224, 170, 255, 0.03);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.4),
      transparent,
      rgba(0, 255, 240, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
  }
`

const BioTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-xl);
  font-weight: var(--font-bold);
  color: var(--silk-plasma-pink);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);

  svg {
    color: var(--silk-circuit-cyan);
    filter: drop-shadow(0 0 8px rgba(0, 255, 240, 0.5));
  }
`

const BioContent = styled.div`
  position: relative;
  z-index: 1;

  p {
    font-family: var(--font-body);
    font-size: var(--text-fluid-base);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    margin-bottom: var(--space-4);

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: var(--silk-lavender);
    font-weight: var(--font-semibold);
  }

  a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    position: relative;
    transition: all var(--duration-fast) var(--ease-silk);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--silk-circuit-cyan), var(--silk-plasma-pink));
      transition: width var(--duration-normal) var(--ease-silk);
    }

    &:hover {
      color: var(--silk-plasma-pink);
      text-shadow: 0 0 8px rgba(255, 117, 216, 0.5);

      &::after {
        width: 100%;
      }
    }
  }
`

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
`

const SkillCategory = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.6) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      135deg,
      transparent,
      rgba(139, 92, 246, 0.1)
    );
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-silk);
  }

  &:hover {
    border-color: rgba(0, 255, 240, 0.3);

    &::before {
      opacity: 1;
    }
  }
`

const SkillTitle = styled.h4`
  font-family: var(--font-mono);
  font-size: 1.4rem;
  font-weight: var(--font-semibold);
  color: var(--silk-circuit-cyan);
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
`

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`

const SkillChip = styled.span`
  padding: var(--space-1-5) var(--space-3);
  background: linear-gradient(
    135deg,
    rgba(255, 117, 216, 0.1),
    rgba(139, 92, 246, 0.08)
  );
  border: 1px solid rgba(255, 117, 216, 0.2);
  border-radius: var(--radius-full);
  font-size: 1.3rem;
  color: var(--silk-lavender);
  transition: all var(--duration-fast) var(--ease-silk);

  &:hover {
    border-color: var(--silk-circuit-cyan);
    color: var(--silk-circuit-cyan);
    background: linear-gradient(
      135deg,
      rgba(0, 255, 240, 0.15),
      rgba(139, 92, 246, 0.1)
    );
    transform: translateY(-2px);
    text-shadow: 0 0 6px rgba(0, 255, 240, 0.5);
  }
`

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);
`

const ContactCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.6) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all var(--duration-normal) var(--ease-silk);

  &:hover {
    border-color: rgba(0, 255, 240, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.2);
  }

  h4 {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    font-weight: var(--font-semibold);
    color: var(--silk-circuit-cyan);
    margin-bottom: var(--space-2);
    text-shadow: 0 0 8px rgba(0, 255, 240, 0.4);
  }

  p {
    font-size: 1.3rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
`

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

const AboutPageContent: React.FC<AboutPageContentProps> = ({ about }) => {
  const { profileImage, profileImageAlt, intro, bio, contactIntro, contactReasons } = about
  const profileImageSrc =
    profileImage === '/images/profile-image.jpg' || !profileImage ? defaultProfileImage : profileImage
  const profilePlaceholder = profileImageSrc === defaultProfileImage ? 'blur' : 'empty'

  const skills = {
    Backend: ['Node.js', 'Python', 'Rust', 'GraphQL', 'PostgreSQL'],
    'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    Frontend: ['React', 'TypeScript', 'Next.js', 'WebGL', 'Styled Components'],
    Specialties: ['AI/ML', 'Android', 'Performance', 'Architecture', 'Open Source'],
  }

  return (
    <PageLayout>
      <PageTitle>About</PageTitle>

      <ContentGrid>
        <ProfileSection>
          <ProfileCard
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <ProfileImageFrame>
              <ProfileImage
                alt={profileImageAlt ?? 'Stefanie Jane'}
                fill={true}
                placeholder={profilePlaceholder}
                sizes="(min-width: 1024px) 380px, 80vw"
                src={profileImageSrc}
              />
            </ProfileImageFrame>
            <ProfileName>
              <SparklingName name={intro?.name ?? 'Stefanie Jane'} sparkleCount={5} />
            </ProfileName>
            <ProfileTitle>Creative Technologist</ProfileTitle>

            <SocialLinks>
              <SocialLink href="https://github.com/hyperb1iss" rel="noopener noreferrer" target="_blank">
                <FaGithub />
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/hyperb1iss" rel="noopener noreferrer" target="_blank">
                <FaLinkedin />
              </SocialLink>
              <SocialLink href="mailto:stef@hyperbliss.tech">
                <FaEnvelope />
              </SocialLink>
            </SocialLinks>
          </ProfileCard>
        </ProfileSection>

        <ContentSection>
          {/* Main Bio Card */}
          <BioCard
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <BioTitle>
              <FaCode /> {intro?.greeting ?? 'Hey there!'}
            </BioTitle>
            <BioContent>
              {intro && (intro.highlightText || intro.introText) && (
                <p>
                  I&apos;ve been building technology for{' '}
                  {intro.highlightText && <strong>{intro.highlightText}</strong>}
                  {intro.introText && ` ${intro.introText}`}
                </p>
              )}
              {bio && <MarkdownRenderer content={bio} />}
            </BioContent>
          </BioCard>

          {/* Technical Arsenal */}
          <BioCard
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <BioTitle>
              <FaMicrochip /> Technical Arsenal
            </BioTitle>
            <SkillsGrid>
              {Object.entries(skills).map(([category, items], index) => (
                <SkillCategory
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  key={category}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <SkillTitle>{category}</SkillTitle>
                  <SkillList>
                    {items.map((skill) => (
                      <SkillChip key={skill}>{skill}</SkillChip>
                    ))}
                  </SkillList>
                </SkillCategory>
              ))}
            </SkillsGrid>
          </BioCard>

          {/* Connect Section */}
          {(contactIntro || (contactReasons && contactReasons.length > 0)) && (
            <BioCard
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <BioTitle>
                <FaRocket /> Let&apos;s Connect
              </BioTitle>
              {contactIntro && (
                <BioContent>
                  <p>{contactIntro}</p>
                </BioContent>
              )}
              {contactReasons && contactReasons.length > 0 && (
                <ContactGrid>
                  {contactReasons.map((reason, index) => (
                    <ContactCard
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      key={reason.title}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    >
                      <h4>{reason.title}</h4>
                      <p>{reason.description}</p>
                    </ContactCard>
                  ))}
                </ContactGrid>
              )}
            </BioCard>
          )}
        </ContentSection>
      </ContentGrid>
    </PageLayout>
  )
}

export default AboutPageContent
