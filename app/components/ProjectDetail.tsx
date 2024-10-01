// app/components/ProjectDetail.tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm"; // For tables, footnotes, etc.
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

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

// Meta information (author, tags)
const ProjectMeta = styled.div`
  font-size: 1.6rem;
  color: var(--color-muted);
  text-align: center;
  margin-bottom: 2rem;

  span {
    margin: 0 0.5rem;
  }
`;

// Content of the project detail with syntax highlighting and GFM support
const ProjectContent = styled(ReactMarkdown).attrs({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
})`
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
    background-color: rgba(0, 0, 0, 0.8);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 1.4rem;
    color: #00ff00; /* Cyberpunk green */
  }

  pre {
    background-color: rgba(10, 10, 20, 0.9);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    font-size: 1.4rem; /* Decreased font size */
    line-height: 1.4; /* Decreased line height */

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  /* Custom styles for syntax highlighting */
  pre code {
    color: #00ff00; /* Cyberpunk green */
  }

  /* Style for tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }

  th,
  td {
    border: 1px solid var(--color-border);
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-accent);
  }

  /* Style for blockquotes */
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

  /* Style for footnotes */
  sup {
    font-size: 0.8em;
  }

  .footnotes {
    margin-top: 2rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.9em;
    color: var(--color-muted);
  }
`;

// Interface for ProjectDetail component props
interface ProjectDetailProps {
  title: string;
  github: string;
  content: string;
  author?: string;
  tags?: string[];
}

/**
 * ProjectDetail component
 * Renders detailed information about a single project with enhanced styling.
 * Supports syntax highlighting, tables, footnotes, and anchors.
 * @param {ProjectDetailProps} props - The component props
 * @returns {JSX.Element} Rendered project detail page
 */
export default function ProjectDetail({
  title,
  github,
  content,
  author,
  tags,
}: ProjectDetailProps) {
  return (
    <ProjectDetailWrapper>
      <PageTitle>{title}</PageTitle>
      <ProjectLinks>
        <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </ProjectLink>
      </ProjectLinks>
      {(author || (tags && tags.length > 0)) && (
        <ProjectMeta>
          {author && <span>Author: {author}</span>}
          {tags && tags.length > 0 && <span>Tags: {tags.join(", ")}</span>}
        </ProjectMeta>
      )}
      <ProjectContent>{content}</ProjectContent>
    </ProjectDetailWrapper>
  );
}
