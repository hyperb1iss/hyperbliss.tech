// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useHeaderContext } from "./HeaderContext";

const HeroSectionWrapper = styled.section<{ $isHeaderExpanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 75vh;
  padding-top: ${(props) =>
    props.$isHeaderExpanded ? "calc(4rem + 100px)" : "4rem"};
  padding-bottom: 4rem;
  padding-left: 2rem;
  padding-right: 2rem;
  overflow: hidden;
  transition: padding-top 0.3s ease;

  @media (max-width: 768px) {
    padding-top: ${(props) =>
      props.$isHeaderExpanded ? "calc(3rem + 80px)" : "3rem"};
    padding-bottom: 3rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

const createParticles = (
  count: number,
  width: number,
  height: number
): Particle[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.5,
    color: `rgba(${Math.floor(Math.random() * 100) + 155}, ${
      Math.floor(Math.random() * 100) + 155
    }, 255, ${Math.random() * 0.3 + 0.2})`,
    vx: Math.random() * 0.2 - 0.1,
    vy: Math.random() * 0.2 - 0.1,
  }));
};

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = createParticles(50, canvas.width, canvas.height);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <ParticleCanvas ref={canvasRef} />;
};

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
  gap: 0.8rem;
  margin-bottom: 2rem;
  max-width: 100%;
`;

const Tag = styled(motion.span)`
  background-color: rgba(162, 89, 255, 0.1);
  color: var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(162, 89, 255, 0.3);
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(162, 89, 255, 0.2);

  &:hover {
    background-color: rgba(162, 89, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(162, 89, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(162, 89, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
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
          I&apos;m <HighlightedName>Stefanie Jane</HighlightedName>, a
          full-stack software engineer and leader. I do everything from embedded
          systems to mobile to cloud. Welcome to my personal site! You&apos;ll
          find my blog, projects, and more about me here.
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
