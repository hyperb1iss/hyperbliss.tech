// app/components/FeaturedProjectsSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import styled from "styled-components";

const FeaturedProjectsSection = styled.section`
  padding: 4rem 2rem;
  background: rgba(10, 10, 20, 0.8);
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  color: #ff00ff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
      <SectionTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Featured Projects
      </SectionTitle>
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
        {projects.slice(0, 4).map((project) => (
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