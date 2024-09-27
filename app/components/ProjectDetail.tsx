// app/components/ProjectDetail.tsx
"use client";

import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import PageTitle from "./PageTitle";
import PageLayout from "./PageLayout";

// Styled components for project details
const ProjectLinks = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const ProjectLink = styled.a`
  font-size: 1.8rem;
  color: var(--color-accent);
  text-decoration: none;
  margin: 0 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-secondary);
    text-decoration: underline;
  }
`;

const ProjectContent = styled.article`
  font-size: 1.8rem;
  line-height: 1.8;
  color: var(--color-text);

  h2 {
    font-size: 2.8rem;
    color: var(--color-accent);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 2.4rem;
    color: var(--color-secondary);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
  }

  a {
    color: var(--color-accent);
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-secondary);
    }
  }

  ul,
  ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  code {
    font-family: var(--font-mono);
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }

  pre {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1.5rem;

    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

// Interface for ProjectDetail component props
interface ProjectDetailProps {
  title: string;
  github: string;
  content: string;
}

/**
 * ProjectDetail component
 * Renders detailed information about a single project.
 * @param {ProjectDetailProps} props - The component props
 * @returns {JSX.Element} Rendered project detail page
 */
export default function ProjectDetail({
  title,
  github,
  content,
}: ProjectDetailProps) {
  return (
    <PageLayout>
      <PageTitle>{title}</PageTitle>
      <ProjectLinks>
        <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </ProjectLink>
      </ProjectLinks>
      <ProjectContent>
        <ReactMarkdown>{content}</ReactMarkdown>
      </ProjectContent>
    </PageLayout>
  );
}
