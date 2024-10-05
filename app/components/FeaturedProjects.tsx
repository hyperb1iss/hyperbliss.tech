// app/components/FeaturedProjects.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaGithub,
} from "react-icons/fa";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";

const FeaturedProjectsSection = styled.section`
  padding: 2rem 0;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 20, 0.9) 0%,
    rgba(20, 20, 40, 0.9) 100%
  );
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #ff00ff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
`;

const ProjectsContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectCard = styled(motion.div)<{ $isCenter: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  width: 280px;
  height: ${(props) => (props.$isCenter ? "260px" : "220px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  opacity: ${(props) => (props.$isCenter ? 1 : 0.7)};
  z-index: ${(props) => (props.$isCenter ? 2 : 1)};

  &:hover {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    transform: translateY(-5px);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  color: #00ffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px #00ffff;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectLink = styled(Link)`
  font-size: 0.9rem;
  color: #ff00ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }
`;

const GithubLink = styled.a`
  font-size: 1.2rem;
  color: #ff00ff;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }
`;

const ControlButton = styled(motion.button)`
  background: rgba(0, 255, 255, 0.1);
  border: none;
  color: #00ffff;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  padding: 1rem;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 255, 255, 0.2);
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, [projects.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
  }, [projects.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext]); 

  const getVisibleProjects = useCallback(() => {
    const prev = (currentIndex - 1 + projects.length) % projects.length;
    const next = (currentIndex + 1) % projects.length;
    return [prev, currentIndex, next];
  }, [currentIndex, projects.length]);

  return (
    <FeaturedProjectsSection>
      <SectionTitle
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <GlitchSpan data-text="Featured Projects">Featured Projects</GlitchSpan>
      </SectionTitle>
      <ProjectsContainer>
        <AnimatePresence initial={false} mode="popLayout">
          {getVisibleProjects().map((index, i) => (
            <ProjectCard
              key={projects[index].slug}
              $isCenter={i === 1}
              initial={{ opacity: 0, x: i === 0 ? -300 : i === 2 ? 300 : 0 }}
              animate={{
                opacity: i === 1 ? 1 : 0.7,
                x: i === 0 ? -300 : i === 2 ? 300 : 0,
                scale: i === 1 ? 1 : 0.9,
              }}
              exit={{ opacity: 0, x: i === 0 ? -300 : i === 2 ? 300 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ left: `${i * 50 - 50}%` }}
            >
              <ProjectTitle>{projects[index].frontmatter.title}</ProjectTitle>
              <ProjectDescription>
                {projects[index].frontmatter.description}
              </ProjectDescription>
              <ProjectLinks>
                <ProjectLink href={`/projects/${projects[index].slug}`}>
                  Learn More
                  <FaArrowRight style={{ marginLeft: "5px" }} />
                </ProjectLink>
                <GithubLink
                  href={projects[index].frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </GithubLink>
              </ProjectLinks>
            </ProjectCard>
          ))}
        </AnimatePresence>
        <ControlButton
          className="prev"
          onClick={handlePrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronLeft />
        </ControlButton>
        <ControlButton
          className="next"
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronRight />
        </ControlButton>
      </ProjectsContainer>
    </FeaturedProjectsSection>
  );
}
