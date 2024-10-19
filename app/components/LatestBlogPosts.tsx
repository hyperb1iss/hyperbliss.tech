// app/components/LatestBlogPosts.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Card from "./Card";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    author?: string;
    tags: string[];
  };
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
  isMobile: boolean;
}

const SidebarContainer = styled(motion.div)`
  width: 100%;
  padding: 8rem 16px 2rem; /* Apply horizontal padding here */
  overflow-y: auto;
`;

const SidebarContent = styled(motion.div)<{ $isMobile: boolean }>`
  display: ${(props) => (props.$isMobile ? "grid" : "flex")};
  flex-direction: column;
  ${(props) =>
    props.$isMobile &&
    `
    grid-template-columns: repeat(2, 1fr);
  `}
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;
  /* Removed padding from here to prevent double padding */

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export default function LatestBlogPosts({
  posts,
  isMobile,
}: LatestBlogPostsProps) {
  return (
    <SidebarContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <StyledTitle>
        <GlitchSpan data-text="Latest Posts">Latest Posts</GlitchSpan>
      </StyledTitle>
      <SidebarContent $isMobile={isMobile}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Card
              key={post.slug}
              title={post.frontmatter.title}
              description={post.frontmatter.excerpt}
              link={`/blog/${post.slug}`}
              color="255, 0, 255"
              linkColor="0, 255, 255"
              tags={post.frontmatter.tags}
              meta={`${new Date(post.frontmatter.date).toLocaleDateString()} ${
                post.frontmatter.author ? `• ${post.frontmatter.author}` : ""
              }`}
              index={index}
              className="blog-post-card"
            />
          ))
        ) : (
          <motion.p>No posts available at the moment.</motion.p>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
}
