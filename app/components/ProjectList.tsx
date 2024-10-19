// app/components/ProjectList.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Card from "./Card";

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
`;

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

interface ProjectListProps {
  projects: Project[];
}

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
        <Card
          key={project.slug}
          title={project.frontmatter.title}
          description={project.frontmatter.description}
          link={`/projects/${project.slug}`}
          color="0, 255, 255"
          linkColor="255, 0, 255"
          tags={project.frontmatter.tags}
          meta={
            project.frontmatter.author
              ? `Author: ${project.frontmatter.author}`
              : undefined
          }
          linkText="Learn More"
          githubLink={project.frontmatter.github}
          index={index}
        />
      ))}
    </ProjectsGrid>
  );
};

export default ProjectList;
