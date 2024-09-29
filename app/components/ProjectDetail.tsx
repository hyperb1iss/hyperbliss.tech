// app/components/ProjectDetail.tsx
"use client";

import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import PageTitle from "./PageTitle";
import PageLayout from "./PageLayout";

/**
 * Styled components for project details
 */

// Wrapper for the project detail content
const ProjectDetailWrapper = styled(PageLayout)`
  max-width: 800px;
  margin: 0 auto;
`;

// Links related to the project
const ProjectLinks = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

// Individual project link
const ProjectLink = styled.a`
  font-size: 1.8rem;
  color: var(--color-secondary);
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: var(--color-primary);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Content of the project detail
const ProjectContent = styled(ReactMarkdown)`
  font-size: 1.8rem;
  line-height: 1.8;
  color: var(--color-text);

  h2 {
    font-size: 3rem;
    color: var(--color-secondary);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 5px var(--color-secondary);
  }

  h3 {
    font-size: 2.4rem;
    color: var(--color-accent);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 5px var(--color-accent);
  }

  p {
    margin-bottom: 1.5rem;
  }

  a {
    color: var(--color-secondary);
    text-decoration: none;
    border-bottom: 1px solid var(--color-secondary);
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-primary);
    }
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

  blockquote {
    border-left: 4px solid var(--color-accent);
    padding-left: 1rem;
    margin-left: 0;
    color: var(--color-muted);
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  ul,
  ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
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
 * Renders detailed information about a single project with enhanced styling.
 * @param {ProjectDetailProps} props - The component props
 * @returns {JSX.Element} Rendered project detail page
 */
export default function ProjectDetail({
  title,
  github,
  content,
}: ProjectDetailProps) {
  return (
    <ProjectDetailWrapper>
      <PageTitle>{title}</PageTitle>
      <ProjectLinks>
        <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </ProjectLink>
      </ProjectLinks>
      <ProjectContent>{content}</ProjectContent>
    </ProjectDetailWrapper>
  );
}
