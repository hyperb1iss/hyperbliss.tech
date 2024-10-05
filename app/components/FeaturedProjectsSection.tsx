// app/components/FeaturedProjectsSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";

const FeaturedProjectsSection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 20, 0.8) 0%,
    rgba(30, 30, 60, 0.8) 100%
  );
  position: relative;
  overflow: hidden;
  border-left: 1px solid rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2rem; // Reduced from 3.5rem to match the Latest Posts title
  color: #ff00ff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
  position: relative;
  padding: 1rem;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 255, 0.1),
    rgba(255, 0, 255, 0.1)
  );
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
    background-size: 200% 100%;
    animation: shimmer 6s linear infinite;
    opacity: 0.5;
    z-index: -1;
  }

  &::after {
    filter: blur(10px);
    opacity: 0.3;
  }

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4);
    border-color: #00ffff;

    &::before,
    &::after {
      opacity: 0.8;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // Changed to 4 columns
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); // Adjust for medium screens
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // Adjust for small screens
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    transform: translateY(-5px);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;  // Changed from 2.2rem to 1.4rem to match sidebar cards
  color: #00ffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px #00ffff;
`;

const ProjectDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectLink = styled(Link)`
  font-size: 1.3rem;
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
  font-size: 1.3rem;
  color: #ff00ff;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
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
  return (
    <FeaturedProjectsSection>
      <StyledTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlitchSpan data-text="Featured Projects">Featured Projects</GlitchSpan>
      </StyledTitle>
      <ProjectsGrid
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {projects.slice(0, 16).map((project) => ( // Adjusted to show up to 16 projects
          <ProjectCard
            key={project.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <ProjectTitle>{project.frontmatter.title}</ProjectTitle>
            <ProjectDescription>
              {project.frontmatter.description}
            </ProjectDescription>
            <ProjectLinks>
              <ProjectLink href={`/projects/${project.slug}`}>
                Learn More
                <FaArrowRight style={{ marginLeft: "5px" }} />
              </ProjectLink>
              <GithubLink
                href={project.frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </GithubLink>
            </ProjectLinks>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </FeaturedProjectsSection>
  );
}