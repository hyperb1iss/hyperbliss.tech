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
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem 2rem;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem 1rem;
  }
`;

/**
 * Title component
 * Centered title with responsive font size and enhanced styling.
 * Shrunk the font size slightly for better visual balance.
 */
const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 3.5vw, 4.5rem); /* Reduced the font size */
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
`;

/**
 * Meta component
 * Centered meta information with responsive font size.
 */
const Meta = styled(motion.div)`
  font-size: clamp(1.4rem, 1.5vw, 2rem);
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

/**
 * Tags styling
 */
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
  font-size: clamp(1.2rem, 1.2vw, 1.6rem);
  text-shadow: 0 0 5px var(--color-accent);
  cursor: pointer;
`;

const Content = styled(motion.div)`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);
`;

/**
 * GitHubLink component
 * Centered GitHub link with responsive font size and enhanced styling.
 */
const GitHubLink = styled(motion.a)`
  display: block;
  margin: 2rem auto 0;
  width: fit-content;
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  text-align: center;

  &:hover {
    color: var(--color-secondary);
  }
`;

/**
 * ProjectDetail component
 * Renders the detailed view of a project with animations.
 * Adjusted font sizes and layout for better widescreen support and consistency.
 * Shrunk the title font size slightly.
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
