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

  @media (max-width: 768px) {
    background: none;
    padding: 2rem 1rem;
  }
`;

const CustomStyledTitle = styled(StyledTitle)`
  padding: ${(props) => (props.$isMobile ? "1rem" : "0.5rem 1rem")};
  border: 1px solid rgba(0, 255, 255, 0.2);
  background: linear-gradient(
    90deg,
    rgba(0, 255, 255, 0.1),
    rgba(255, 0, 255, 0.1)
  );

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
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 2x2 grid on mobile
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
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4);
    transform: translateY(-5px);
    border-color: #00ffff;

    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
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
      <CustomStyledTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        $isMobile={true}
      >
        <GlitchSpan data-text="Featured Projects">Featured Projects</GlitchSpan>
      </CustomStyledTitle>
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
        {projects.slice(0, 4).map((project) => ( // Show up to 4 projects for 2x2 grid
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