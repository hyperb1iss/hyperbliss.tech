// app/components/BlogPost.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import MarkdownRenderer from "./MarkdownRenderer";

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
    font-weight: bold;
    color: var(--color-primary);
    background: var(--color-tag-background);
    padding: 0.3rem 0.6rem;
    border-radius: 5px;
    box-shadow: 0 0 5px var(--color-card-hover-shadow1);
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
  background-color: var(--color-tag-background);
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
