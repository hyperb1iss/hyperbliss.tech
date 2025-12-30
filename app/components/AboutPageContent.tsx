'use client'

// app/components/AboutPageContent.tsx
// Magazine-style about page with floating profile image and flowing narrative

import { motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'
import type { AboutSection } from '@/lib/tina'
import MarkdownRenderer from './MarkdownRenderer'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import SparklingName from './SparklingName'

interface AboutPageContentProps {
  about: AboutSection
}

// ═══════════════════════════════════════════════════════════════════════════
// Styled Components
// ═══════════════════════════════════════════════════════════════════════════

const ContentWrapper = styled(motion.div)`
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 2rem auto;
`

const ProfileImage = styled(motion.img)`
  float: left;
  width: clamp(200px, 20vw, 400px);
  height: auto;
  border-radius: 50% / 40%;
  box-shadow: 0 0 20px rgba(162, 89, 255, 0.3);
  margin: 0 3rem 2rem 0;
  transition: all 0.3s ease-in-out;
  border: 2px solid rgba(162, 89, 255, 0.2);
  shape-outside: circle(50%);
  filter: saturate(1.1) brightness(1.05);

  &:hover {
    transform: scale(1.05) rotate(-2deg);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5),
      0 0 60px rgba(162, 89, 255, 0.2);
    border-color: rgba(0, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    float: none;
    margin: 0 auto 2rem auto;
    width: 80%;
    max-width: 300px;
    display: block;
  }
`

const TextContent = styled(motion.div)`
  width: 100%;
  text-align: justify;

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
  }
`

const IntroParagraph = styled.p`
  font-size: clamp(1.6rem, 2vw, 2rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2.5rem;
  margin-top: 0;
  letter-spacing: 0.02em;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

const BioParagraphs = styled.div`
  /* Styled wrapper for TinaCMS bio content */
  p {
    font-size: clamp(1.4rem, 1.8vw, 1.8rem);
    line-height: 1.5;
    color: var(--color-text);
    margin-bottom: 2.5rem;
    opacity: 0.9;
    transition: all 0.3s ease;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.01em;

    &:hover {
      opacity: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    position: relative;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    padding: 0 0.2em;
    white-space: nowrap;

    &:hover {
      color: var(--color-secondary);
      text-shadow: 0 0 15px rgba(255, 117, 216, 0.4);
    }
  }
`

const ContactSection = styled.div`
  margin-top: 4rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(162, 89, 255, 0.1);
  background: linear-gradient(180deg, transparent 0%, rgba(162, 89, 255, 0.03) 100%);
  border-radius: 0 0 20px 20px;
`

const ContactIntroParagraph = styled.p`
  font-size: clamp(1.4rem, 1.8vw, 1.8rem);
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: 1rem;
  opacity: 0.95;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
`

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;
`

const ContactReasonCard = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, rgba(162, 89, 255, 0.05) 0%, rgba(0, 255, 255, 0.05) 100%);
  border-radius: 10px;
  transition: all 0.4s ease-out;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(162, 89, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    border: 1px solid rgba(162, 89, 255, 0.1);
    box-shadow: 0 5px 15px rgba(162, 89, 255, 0.1), 0 15px 40px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }
  }

  h3 {
    color: var(--color-accent);
    font-size: 1.8rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.02em;

    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      width: 4px;
      height: 0;
      background: linear-gradient(to bottom, var(--color-accent), var(--color-secondary));
      transition: height 0.3s ease, transform 0.3s ease;
      transform: translateY(-50%);
      border-radius: 2px;
    }
  }

  &:hover h3 {
    transform: translateX(5px);
    color: var(--color-secondary);
  }

  p {
    font-size: 1.6rem;
    margin: 0;
    line-height: 1.5;
    opacity: 0.9;
    position: relative;
    z-index: 2;
    text-align: left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
`

const GradientText = styled.span`
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-shadow: none;
  filter: brightness(1.2);
  padding: 0 0.2em;
`

// ═══════════════════════════════════════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════════════════════════════════════

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

const AboutPageContent: React.FC<AboutPageContentProps> = ({ about }) => {
  const { profileImage, profileImageAlt, intro, bio, contactIntro, contactReasons } = about

  return (
    <PageLayout>
      <PageTitle>About Me</PageTitle>
      <ContentWrapper animate="visible" initial="hidden" variants={contentVariants}>
        {/* Profile Image */}
        <motion.div variants={itemVariants}>
          <ProfileImage
            alt={profileImageAlt ?? 'Profile image'}
            src={profileImage ?? '/images/profile-image.jpg'}
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>

        <TextContent>
          {/* Intro paragraph with SparklingName and GradientText */}
          {intro && (
            <motion.div variants={itemVariants}>
              <IntroParagraph>
                {intro.greeting} I&apos;m <SparklingName name={intro.name ?? ''} />, and I&apos;ve spent
                <GradientText> {intro.highlightText} </GradientText>
                {intro.introText}
              </IntroParagraph>
            </motion.div>
          )}

          {/* Bio paragraphs from TinaCMS */}
          {bio && (
            <motion.div variants={itemVariants}>
              <BioParagraphs>
                <MarkdownRenderer content={bio} />
              </BioParagraphs>
            </motion.div>
          )}

          {/* Contact Section */}
          {(contactIntro || (contactReasons && contactReasons.length > 0)) && (
            <motion.div
              variants={{
                ...itemVariants,
                visible: {
                  ...itemVariants.visible,
                  transition: {
                    duration: 0.7,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              <ContactSection>
                {contactIntro && <ContactIntroParagraph>{contactIntro}</ContactIntroParagraph>}

                {contactReasons && contactReasons.length > 0 && (
                  <ContactGrid>
                    {contactReasons.map((item, index) => (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        key={item.title}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <ContactReasonCard>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </ContactReasonCard>
                      </motion.div>
                    ))}
                  </ContactGrid>
                )}
              </ContactSection>
            </motion.div>
          )}
        </TextContent>
      </ContentWrapper>
    </PageLayout>
  )
}

export default AboutPageContent
