// app/components/LatestBlogPosts.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";

const SidebarContainer = styled(motion.div)<{ $isMobile: boolean }>`
  width: 100%;
  padding: 8rem 2rem 2rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    height: 100%;
  }
`;

const SidebarContent = styled(motion.div)<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isMobile ? "repeat(2, 1fr)" : "1fr"};
  gap: 1rem;
`;

const BlogPostCard = styled(motion.div)<{ $isMobile: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.2rem;
  position: relative;
  overflow: hidden;
  margin-bottom: ${(props) => (props.$isMobile ? "0" : "0.8rem")};
  cursor: pointer;
  height: ${(props) => (props.$isMobile ? "auto" : "auto")};
  min-height: ${(props) => (props.$isMobile ? "220px" : "auto")};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2);
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: 1.6rem;
  color: #ff00ff;
  margin-bottom: 0.6rem;
  text-shadow: 0 0 5px #ff00ff;
  font-family: var(--font-heading);
`;

const PostExcerpt = styled.p<{ $isMobile: boolean }>`
  font-size: 1.3rem;
  color: var(--color-text);
  margin-bottom: 0.4rem;
  line-height: 1.4;
  opacity: 0.9;
  flex-grow: 1;
`;

const ReadMoreLink = styled.span<{ $isMobile: boolean }>`
  font-size: 1.4rem;
  color: #00ffff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  width: fit-content;
  padding-top: 0.5rem;
  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 5px #ff00ff;
  }
`;

const DateTag = styled.span<{ $isMobile: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 0, 255, 0.2);
  color: #ff00ff;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 1.3rem;
  text-shadow: 0 0 3px #ff00ff;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  text-shadow: 0 0 3px #00ffff;
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
  };
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
  isMobile: boolean;
}

const LatestBlogPosts: React.FC<LatestBlogPostsProps> = ({
  posts,
  isMobile,
}) => {
  return (
    <SidebarContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      $isMobile={isMobile}
    >
      <SidebarContent
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        $isMobile={isMobile}
      >
        <StyledTitle
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          $isMobile={isMobile}
          style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}
        >
          <GlitchSpan data-text="Latest Posts">Latest Posts</GlitchSpan>
        </StyledTitle>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} passHref>
              <BlogPostCard
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                $isMobile={isMobile}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <PostTitle $isMobile={isMobile}>
                  {post.frontmatter.title}
                </PostTitle>
                <PostExcerpt $isMobile={isMobile}>
                  {post.frontmatter.excerpt}
                </PostExcerpt>
                <TagsContainer>
                  {post.frontmatter.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
                <ReadMoreLink $isMobile={isMobile}>
                  Read More <FaChevronRight style={{ marginLeft: "5px" }} />
                </ReadMoreLink>
                <DateTag $isMobile={isMobile}>
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </DateTag>
              </BlogPostCard>
            </Link>
          ))
        ) : (
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            No posts available at the moment.
          </motion.p>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default LatestBlogPosts;
