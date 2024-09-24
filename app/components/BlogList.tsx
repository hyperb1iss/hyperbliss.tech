// app/components/BlogList.tsx
"use client";

import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import PageTitle from "./PageTitle";
import PageLayout from "./PageLayout";

const PostList = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
`;

const PostCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 255, 255, 0.2);
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
    <PageLayout>
      <PageTitle>Blog</PageTitle>
      <PostList
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.15,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {posts.map(({ slug, frontmatter }) => (
          <PostCard
            key={slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
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
    </PageLayout>
  );
}
