// app/components/ProjectDetail.tsx
"use client";

import { motion } from "framer-motion";
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
  padding: 8rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem 1rem;
  }
`;

// Centered Title with underline effect and animation
const Title = styled(motion.h1)`
  font-size: 3rem;
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 7px #00ffff;
  text-align: center;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 2px;
    background: var(--color-primary);
    left: 25%;
    bottom: -10px;
    box-shadow: 0 0 10px var(--color-primary);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// Centered Meta Information with improved styling
const Meta = styled(motion.div)`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;

  span {
    margin: 0 0.5rem;
  }
`;

// Tags styling
const TagsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  background-color: rgba(0, 255, 255, 0.2);
  color: var(--color-accent);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-shadow: 0 0 5px var(--color-accent);
  cursor: pointer; /* Show hover cursor */
`;

// Centered GitHub Link with animation
const GitHubLink = styled(motion.a)`
  display: block;
  margin: 2rem auto 0;
  width: fit-content;
  font-size: 1.6rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  text-align: center;

  &:hover {
    color: var(--color-secondary);
  }
`;

const Content = styled(motion.div)``;

/**
 * ProjectDetail component
 * Renders the detailed view of a project with animations.
 * @param {ProjectDetailProps} props - The component props
 * @returns {JSX.Element} Rendered project detail
 */
const ProjectDetail: React.FC<ProjectDetailProps> = ({
  title,
  github,
  content,
  author,
  tags,
}) => {
  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </Title>
      <Meta
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {author && <span>Author: {author}</span>}
      </Meta>
      {tags && tags.length > 0 && (
        <TagsContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      )}
      <Content
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <MarkdownRenderer content={content} />
      </Content>
      <GitHubLink
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        View on GitHub
      </GitHubLink>
    </Container>
  );
};

export default ProjectDetail;
