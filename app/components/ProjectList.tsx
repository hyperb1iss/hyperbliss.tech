// app/components/ProjectList.tsx
"use client";

import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled components for project list
const ProjectsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px; // Increased border radius
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); // Enhanced shadow

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-10px) scale(1.05); // Slightly increased scale
    box-shadow: 0 15px 30px rgba(0, 255, 255, 0.3); // Enhanced hover shadow
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

const ProjectLink = styled(Link)`
  font-size: 1.6rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-secondary);
    text-decoration: underline;
  }
`;

// Interface for project data
interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

// Interface for ProjectList component props
interface ProjectListProps {
  projects: Project[];
}

/**
 * ProjectList component
 * Renders a grid of project cards with animations.
 * @param {ProjectListProps} props - The component props
 * @returns {JSX.Element} Rendered project list
 */
const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <ProjectsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <ProjectsGrid
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.15,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {projects.map(({ slug, frontmatter }) => (
          <ProjectCard
            key={slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div>
              <ProjectTitle>{frontmatter.title}</ProjectTitle>
              <ProjectDescription>{frontmatter.description}</ProjectDescription>
            </div>
            <div>
              <ProjectLink href={`/projects/${slug}`}>Learn More</ProjectLink>
              {" | "}
              <ProjectLink
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </ProjectLink>
            </div>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default ProjectList;
