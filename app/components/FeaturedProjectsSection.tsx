// app/components/FeaturedProjectsSection.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";
import Card from "./Card";

const FeaturedProjectsSectionWrapper = styled.section`
  padding: 4rem 16px;
  position: relative;
  overflow: hidden;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 800px;
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
  }
`;

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
    tags: string[];
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({
  projects,
}: FeaturedProjectsProps) {
  // Limit the projects to a maximum of 4
  const displayedProjects = projects.slice(0, 6);

  return (
    <FeaturedProjectsSectionWrapper>
      <StyledTitle>
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
        {displayedProjects.map((project, index) => (
          <Card
            key={project.slug}
            title={project.frontmatter.title}
            description={project.frontmatter.description}
            link={`/projects/${project.slug}`}
            color="0, 255, 255"
            linkColor="255, 0, 255"
            tags={project.frontmatter.tags}
            githubLink={project.frontmatter.github}
            linkText="Learn More"
            index={index}
            className="project-card"
          />
        ))}
      </ProjectsGrid>
    </FeaturedProjectsSectionWrapper>
  );
}
