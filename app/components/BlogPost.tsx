// app/components/BlogPost.tsx
"use client";

import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import PageTitle from "./PageTitle";
import PageLayout from "./PageLayout";

const PostDate = styled.p`
  font-size: 1.6rem;
  color: var(--color-muted);
  text-align: center;
  margin-bottom: 3rem;
`;

const PostContent = styled.article`
  font-size: 1.8rem;
  line-height: 1.8;
  color: var(--color-text);

  h1 {
    display: none; // Hide the title from the markdown content
  }

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

  blockquote {
    border-left: 4px solid var(--color-accent);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--color-muted);
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

interface BlogPostProps {
  title: string;
  date: string;
  content: string;
}

export default function BlogPost({ title, date, content }: BlogPostProps) {
  return (
    <PageLayout>
      <PageTitle>{title}</PageTitle>
      <PostDate>{new Date(date).toLocaleDateString()}</PostDate>
      <PostContent>
        <ReactMarkdown>{content}</ReactMarkdown>
      </PostContent>
    </PageLayout>
  );
}
