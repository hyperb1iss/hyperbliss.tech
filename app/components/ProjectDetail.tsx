// app/components/ProjectDetail.tsx
"use client";

import React from "react";
import styled from "styled-components";
import MarkdownRenderer from "./MarkdownRenderer";

interface ProjectDetailProps {
  title: string;
  github: string;
  content: string;
  author?: string;
  tags?: string[];
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

// Centered Title
const Title = styled.h1`
  font-size: 3rem;
  color: var(--color-secondary);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--color-secondary);
  text-align: center; /* Center the main title */

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// Centered Meta Information
const Meta = styled.div`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 2rem;
  text-align: center; /* Center the metadata */

  span {
    margin-right: 1rem;
  }
`;

// Centered GitHub Link
const GitHubLink = styled.a`
  display: block; /* Changed to block to center the link */
  margin: 2rem auto 0; /* Centered with auto margins */
  width: fit-content; /* Shrinks to fit content */
  font-size: 1.6rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  text-align: center; /* Ensures the link is centered within its container */

  &:hover {
    color: var(--color-secondary);
  }
`;

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  title,
  github,
  content,
  author,
  tags,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Meta>
        {author && <span>Author: {author}</span>}
        {tags && tags.length > 0 && <span>Tags: {tags.join(", ")}</span>}
      </Meta>
      <MarkdownRenderer content={content} />
      <GitHubLink href={github} target="_blank" rel="noopener noreferrer">
        View on GitHub
      </GitHubLink>
    </Container>
  );
};

export default ProjectDetail;
