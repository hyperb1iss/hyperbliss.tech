// app/components/ProjectList.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import { ProjectCard } from "./ProjectCard";

/**
 * Styled components for project list
 * Adjusted grid layout for better responsiveness on large screens.
 */
const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
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
 * Adjusted grid and card styles for better appearance on large screens.
 * @param {ProjectListProps} props - The component props
 * @returns {JSX.Element} Rendered project list
 */
const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
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
  );
};

export default ProjectList;
