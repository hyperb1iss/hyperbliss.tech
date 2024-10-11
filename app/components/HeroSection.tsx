// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { useHeaderContext } from "./HeaderContext";
import styled from "styled-components";

const HeroSectionWrapper = styled.section<{ $isHeaderExpanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 75vh;
  padding-top: ${props => props.$isHeaderExpanded ? 'calc(4rem + 100px)' : '4rem'};
  padding-bottom: 4rem;
  padding-left: 2rem;
  padding-right: 2rem;
  overflow: hidden;
  transition: padding-top 0.3s ease;

  @media (max-width: 768px) {
    padding-top: ${props => props.$isHeaderExpanded ? 'calc(3rem + 80px)' : '3rem'};
    padding-bottom: 3rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const AnimatedBackground = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 0, 255, 0.15),
    transparent 70%
  );
  background-size: cover;
  opacity: 0.5;
  animation: rotateBG 60s linear infinite;
  z-index: -1;

  @keyframes rotateBG {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContentWrapper = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  text-shadow: 0 0 20px var(--color-primary);
  letter-spacing: 2px;
  font-family: var(--font-heading);
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), transparent);
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--color-secondary);
  text-shadow: 0 0 15px var(--color-secondary);
  line-height: 1.6;
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HighlightedName = styled.span`
  color: var(--color-accent);
  font-weight: bold;
  text-shadow: 0 0 10px var(--color-accent);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-accent);
    box-shadow: 0 0 5px var(--color-accent);
  }
`;

const TagCloud = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tag = styled(motion.span)`
  background-color: rgba(162, 89, 255, 0.1);
  color: var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(162, 89, 255, 0.3);

  &:hover {
    background-color: rgba(162, 89, 255, 0.2);
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(162, 89, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
`;

const CTAButton = styled(motion.a)`
  background-color: transparent;
  color: var(--color-accent);
  padding: 1rem 2rem;
  border: 2px solid var(--color-accent);
  border-radius: 50px;
  font-size: 1.4rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-accent);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--color-background);
    box-shadow: 0 0 15px rgba(162, 89, 255, 0.7);
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.8rem 1.6rem;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 2;
`;

const tags = [
  "Android OS",
  "Cloud Services",
  "Infrastructure",
  "Firmware",
  "Linux Kernel",
  "Frontend",
  "Embedded Systems",
  "DevOps",
  "Open Source",
  "System Architecture",
  "IoT",
  "Mobile Development",
  "Rust",
  "AWS",
  "Cybersecurity",
  "CI/CD",
  "Kotlin",
  "React & Next.js",
  "Scalable Systems",
  "API Design",
];

export default function HeroSection(): JSX.Element {
  const { isExpanded } = useHeaderContext();

  return (
    <HeroSectionWrapper $isHeaderExpanded={isExpanded}>
      <AnimatedBackground />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title>Welcome to Hyperbliss</Title>
        <Subtitle>
          I&apos;m <HighlightedName>Stefanie Jane</HighlightedName>, a full-stack
          software engineer and leader. I do everything from
          embedded systems to mobile to cloud. Welcome to my personal
          site! You&apos;ll find my blog, projects, and more about me here.
        </Subtitle>
        <TagCloud>
          {tags.map((tag, index) => (
            <Tag
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.03 }}
            >
              {tag}
            </Tag>
          ))}
        </TagCloud>
        <CTAButton
          href="/about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonText>Learn More</ButtonText>
        </CTAButton>
      </ContentWrapper>
    </HeroSectionWrapper>
  );
}