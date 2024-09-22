// app/components/ProjectList.tsx
"use client";

import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

const ProjectTitle = styled.h2`
  font-size: 2.4rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
`;

const ProjectLink = styled.a`
  font-size: 1.6rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-secondary);
    text-decoration: underline;
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

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <ProjectsContainer>
      <ProjectsGrid>
        {projects.map(({ slug, frontmatter }) => (
          <ProjectCard
            key={slug}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div>
              <ProjectTitle>{frontmatter.title}</ProjectTitle>
              <ProjectDescription>{frontmatter.description}</ProjectDescription>
            </div>
            <div>
              <Link href={`/projects/${slug}`} passHref>
                <ProjectLink>Learn More</ProjectLink>
              </Link>
              {" | "}
              <ProjectLink href={frontmatter.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </ProjectLink>
            </div>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
}