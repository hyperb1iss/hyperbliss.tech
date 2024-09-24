// app/components/ProjectsPageContent.tsx
"use client";

import ProjectList from "./ProjectList";
import PageTitle from "./PageTitle";
import PageLayout from "./PageLayout";

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

const ProjectsPageContent: React.FC<ProjectsPageContentProps> = ({
  projects,
}) => {
  return (
    <PageLayout>
      <PageTitle>Projects</PageTitle>
      <ProjectList projects={projects} />
    </PageLayout>
  );
};

export default ProjectsPageContent;
