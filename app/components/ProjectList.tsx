// app/components/ProjectList.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import { ProjectCard } from "./ProjectCard";

/**
 * Styled components for project list
 */
const ProjectsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

/**
 * Interface for project data
 */
interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
    author?: string;
    tags?: string[];
  };
}

/**
 * Props interface for ProjectList component
 */
interface ProjectListProps {
  projects: Project[];
}

/**
 * ProjectList component
 * Renders a grid of project cards with animations.
 * Added staggered animation for enhanced visual effect.
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
              staggerChildren: 0.15, // Staggered animation
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            title={project.frontmatter.title}
            description={project.frontmatter.description}
            github={project.frontmatter.github}
            author={project.frontmatter.author}
            tags={project.frontmatter.tags}
            index={index}
          />
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default ProjectList;
