// app/components/BlogList.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";
import { PostCard } from "./PostCard";

// Styled components for the blog list
const PostList = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
`;

// Interface for blog post data
interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
  };
}

// Props interface for BlogList component
interface BlogListProps {
  posts: Post[];
}

/**
 * BlogList component
 * Renders a list of blog posts with animations.
 * @param {BlogListProps} props - The component props
 * @returns {JSX.Element} Rendered blog list
 */
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
            slug={slug}
            title={frontmatter.title}
            date={frontmatter.date}
            excerpt={frontmatter.excerpt}
          />
        ))}
      </PostList>
    </PageLayout>
  );
}
