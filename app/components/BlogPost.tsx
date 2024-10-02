// app/components/BlogPost.tsx
"use client";

import React from "react";
import styled from "styled-components";
import MarkdownRenderer from "./MarkdownRenderer";
import { motion } from "framer-motion";

interface BlogPostProps {
  title: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem; /* Added top padding */

  @media (max-width: 768px) {
    padding: 3rem 1rem 1rem;
  }
`;

// Centered Title with underline effect and animation
const Title = styled(motion.h1)`
  font-size: 3rem;
  color: #ff00ff;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #ff00ff;
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
  background-color: rgba(162, 89, 255, 0.2);
  color: var(--color-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-shadow: 0 0 5px var(--color-primary);
  cursor: pointer; /* Show hover cursor */
`;

const Content = styled(motion.div)``;

/**
 * BlogPost component
 * Renders the detailed view of a blog post with animations.
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
        <span>{new Date(date).toLocaleDateString()}</span>
        {author && <span>• {author}</span>}
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
