// app/components/ProjectsPageContent.tsx
"use client";

import styled from "styled-components";
import ProjectList from "./ProjectList";

const MainContent = styled.main`
  padding-top: 80px; // Adjust this value based on your header height
`;

const ProjectsTitle = styled.h1`
  font-size: 4rem;
  color: var(--color-primary);
  text-align: center;
  margin: 2rem 0;
`;

interface Project {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    github: string;
  };
}

interface ProjectsPageContentProps {
  projects: Project[];
}

export default function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  return (
    <MainContent>
      <ProjectsTitle>Projects</ProjectsTitle>
      <ProjectList projects={projects} />
    </MainContent>
  );
}