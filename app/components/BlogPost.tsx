// app/components/BlogPost.tsx
"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import PageLayout from "./PageLayout";

/**
 * Styled components for the blog post content
 */

// Wrapper for the blog post content
const BlogPostWrapper = styled(PageLayout)`
  max-width: 800px;
  margin: 0 auto;
`;

// Title of the blog post
const PostTitle = styled(motion.h1)`
  font-size: 4rem;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

// Meta information (date)
const PostMeta = styled.div`
  font-size: 1.6rem;
  color: var(--color-muted);
  text-align: center;
  margin-bottom: 2rem;
`;

// Content of the blog post
const PostContent = styled(ReactMarkdown)`
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

// Interface for the BlogPost component props
interface BlogPostProps {
  title: string;
  date: string;
  content: string;
}

/**
 * BlogPost component
 * Renders the full content of a blog post with enhanced styling.
 * @param {BlogPostProps} props - The component props
 * @returns {JSX.Element} Rendered blog post
 */
export default function BlogPost({ title, date, content }: BlogPostProps) {
  return (
    <BlogPostWrapper>
      <PostTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </PostTitle>
      <PostMeta>{new Date(date).toLocaleDateString()}</PostMeta>
      <PostContent>{content}</PostContent>
    </BlogPostWrapper>
  );
}
