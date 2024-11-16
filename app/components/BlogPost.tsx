// app/components/BlogPost.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import MarkdownRenderer from "./MarkdownRenderer";
import { SparklingName } from "./SparklingName";

interface BlogPostProps {
  title: string;
  date: string;
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
    padding: 6rem 1rem 1rem;
  }
`;

/**
 * Title component
 * Centered title with responsive font size and enhanced styling.
 * Shrunk the font size slightly for better visual balance.
 */
const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 3.5vw, 4.5rem); /* Reduced the font size */
  color: var(--color-secondary);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--color-secondary);
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
 * Refined meta information with cleaner styling and better alignment
 */
const Meta = styled(motion.div)`
  font-size: clamp(1.4rem, 1.5vw, 2rem);
  color: var(--color-muted);
  margin: 2rem 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;

  .date {
    color: var(--color-primary);
    font-weight: 700;
    text-shadow: 0 0 3px var(--color-primary);
  }

  .separator {
    color: var(--color-accent);
    margin: 0 0.2rem;
    font-weight: 300;
    text-shadow: 0 0 3px var(--color-accent);
  }

  .author-wrapper {
    display: flex;
    align-items: center;
    color: var(--color-primary);
    text-shadow: 0 0 3px var(--color-primary);

    /* Override SparklingName default color */
    span {
      color: var(--color-primary);
    }
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
  background-color: rgba(255, 0, 255, 0.2);
  color: var(--color-secondary);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: clamp(1.2rem, 1.2vw, 1.6rem);
  text-shadow: 0 0 5px var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Content = styled(motion.div)`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);
`;

/**
 * BlogPost component
 * Renders the detailed view of a blog post with animations.
 * Adjusted font sizes and layout for better widescreen support and consistency.
 * Shrunk the title font size slightly.
 * @param {BlogPostProps} props - The component props
 * @returns {JSX.Element} Rendered blog post
 */
const BlogPost: React.FC<BlogPostProps> = ({
  title,
  date,
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
        <span className="date">{new Date(date).toLocaleDateString()}</span>
        {author && (
          <>
            <span className="separator">•</span>
            <span className="author-wrapper">
              <SparklingName name={author} sparkleCount={3} />
            </span>
          </>
        )}
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
    </Container>
  );
};

export default BlogPost;
