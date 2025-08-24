// app/components/AboutPageContent.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { FaCode, FaEnvelope, FaGithub, FaLinkedin, FaMicrochip, FaRocket } from 'react-icons/fa6'
import styled, { keyframes } from 'styled-components'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

// Subtle float animation
const _floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`

// Gradient shift for text
const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`

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
  overflow: hidden;
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

const ProfileImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  filter: saturate(1.1) brightness(1.05);
  position: relative;
  z-index: 1;
`

const ProfileName = styled.h2`
  font-family: 'Audiowide', var(--font-display);
  font-size: var(--text-fluid-2xl);
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
  margin-bottom: var(--space-2);
  animation: ${gradientShift} 4s ease infinite;
  filter: drop-shadow(0 0 10px rgba(255, 117, 216, 0.4));
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
  font-family: 'Audiowide', var(--font-display);
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

const BioText = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 1;
  
  &:last-child {
    margin-bottom: 0;
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

const AboutPageContent: React.FC = () => {
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
            <ProfileImage
              alt="Stefanie Jane"
              src="/images/profile-image.jpg"
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            />
            <ProfileName>Stefanie Jane</ProfileName>
            <ProfileTitle>Full-Stack Engineer & Creative Technologist</ProfileTitle>

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
          <BioCard
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <BioTitle>
              <FaCode /> Engineering Excellence
            </BioTitle>
            <BioText>
              With over <strong>two decades</strong> in technology, I've journeyed from kernel hacking to cloud
              architecture, always seeking the perfect fusion of art and code. My expertise spans the entire stack—from
              embedded systems and Android OS development to modern web frameworks and AI/ML applications.
            </BioText>
            <BioText>
              I've led engineering teams at companies like <strong>T-Mobile</strong> and <strong>Microsoft</strong>,
              pioneered open-source innovations, and consistently pushed the boundaries of what's possible in software.
              My passion lies in building extraordinary digital experiences that challenge conventions and create
              meaningful impact.
            </BioText>
          </BioCard>

          <BioCard
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <BioTitle>
              <FaRocket /> Beyond the Code
            </BioTitle>
            <BioText>
              I'm a <strong>music producer</strong>, hardware tinkerer, and perpetual learner. I believe the best
              technology emerges at the intersection of diverse disciplines. Whether crafting elegant algorithms,
              designing intuitive interfaces, or composing electronic music, I bring creativity and precision to
              everything I create.
            </BioText>
            <BioText>
              Currently focused on building next-generation <strong>AI-powered applications</strong> and exploring the
              frontiers of human-computer interaction. Always excited to collaborate on projects that merge technical
              excellence with creative vision.
            </BioText>
          </BioCard>

          <BioCard
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
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
        </ContentSection>
      </ContentGrid>
    </PageLayout>
  )
}

export default AboutPageContent
