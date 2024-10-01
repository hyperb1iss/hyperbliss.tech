// app/components/BlogPost.tsx
"use client";

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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

// Centered Title
const Title = styled.h1`
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px var(--color-primary);
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

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  date,
  content,
  author,
  tags,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Meta>
        <span>{new Date(date).toLocaleDateString()}</span>
        {author && <span>• {author}</span>}
        {tags && tags.length > 0 && <span>• Tags: {tags.join(", ")}</span>}
      </Meta>
      <MarkdownRenderer content={content} />
    </Container>
  );
};

export default BlogPost;
