// app/components/ProjectCard.tsx
import React from "react";
import Card from "./Card";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  github: string;
  author?: string;
  tags?: string[];
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  github,
  author,
  tags,
  index,
}) => {
  return (
    <Card
      title={title}
      description={description}
      link={`/projects/${slug}`}
      color="0, 255, 255"
      linkColor="255, 0, 255"
      tags={tags}
      meta={author ? `Author: ${author}` : undefined}
      linkText="Learn More"
      githubLink={github}
      index={index}
    />
  );
};
