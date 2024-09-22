// app/components/BlogList.tsx
"use client";

import Link from "next/link";
import styled from "styled-components";

const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 20px 40px;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
`;

const PostList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
`;

const PostCard = styled.article`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const PostTitle = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 1rem;
`;

const PostLink = styled(Link)`
  color: var(--color-accent);
  &:hover {
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 1rem;
`;

const PostExcerpt = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-text);
`;

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
  };
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <MainContent>
      <Title>Blog</Title>
      <PostList>
        {posts.map(({ slug, frontmatter }) => (
          <PostCard key={slug}>
            <PostTitle>
              <PostLink href={`/blog/${slug}`}>{frontmatter.title}</PostLink>
            </PostTitle>
            <PostMeta>
              {new Date(frontmatter.date).toLocaleDateString()}
            </PostMeta>
            <PostExcerpt>{frontmatter.excerpt}</PostExcerpt>
          </PostCard>
        ))}
      </PostList>
    </MainContent>
  );
}
