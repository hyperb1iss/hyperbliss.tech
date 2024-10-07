// app/components/LatestBlogPosts.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";

const SidebarContainer = styled(motion.div)<{
  $isCollapsed: boolean;
  $isMobile: boolean;
  $isHeaderExpanded: boolean;
}>`
  ${(props) =>
    props.$isMobile
      ? `
    position: relative;
    width: 100%;
    max-width: 100%;
    background: none;
    border-left: none;
    padding: 2rem;
    overflow-y: visible;
    max-height: none;
  `
      : `
    position: sticky;
    top: 0;
    right: 0;
    width: ${props.$isCollapsed ? "40px" : "300px"};
    background: linear-gradient(
      135deg,
      rgba(10, 10, 20, 0.8) 0%,
      rgba(30, 30, 60, 0.8) 100%
    );
    border-left: 1px solid rgba(0, 255, 255, 0.2);
    padding: ${props.$isCollapsed ? "1rem 0" : "2rem"};
    padding-top: calc(100px + 2rem); // Adjusted to account for header height plus desired top padding
    margin-top: -100px; // Added to offset the top position
    transition: width 0.3s ease;
    z-index: 10;
    height: 100vh;
    overflow-y: auto;
  `}

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(10, 10, 20, 0.8);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 255, 255, 0.5);
    border-radius: 2px;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
  background: rgba(0, 255, 255, 0.2);
  border: none;
  color: #00ffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

  &:hover {
    background: rgba(0, 255, 255, 0.4);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
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
  padding: 1.7rem;
  position: relative;
  overflow: hidden;
  margin-bottom: ${(props) => (props.$isMobile ? "0" : "0.8rem")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: ${(props) => (props.$isMobile ? "280px" : "auto")};

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(0, 255, 255, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.4), 0 0 50px rgba(255, 0, 255, 0.3);
  }

  .hover-icon {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%) translateX(20px) rotate(-45deg);
    opacity: 0;
    transition: all 0.3s ease;
    color: #00ffff;
    font-size: 2rem;
  }
`;

const PostTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: 1.4rem;
  color: #ff00ff;
  margin-bottom: 0.8rem;
  text-shadow: 0 0 7px #ff00ff;
  font-family: var(--font-heading);
`;

const PostExcerpt = styled.p<{ $isMobile: boolean }>`
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 0.6rem;
  line-height: 1.5;
  opacity: 0.95;
  flex-grow: 1;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreLink = styled.span<{ $isMobile: boolean }>`
  font-size: 1.3rem;
  color: #00ffff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  width: fit-content;
  margin-top: 0.8rem;

  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 7px #ff00ff;
  }
`;

const HoverIcon = styled(FaArrowRight)``;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  color: #00ffff;
  text-shadow: 0 0 5px #00ffff;

  svg {
    margin-right: 0.4rem;
    font-size: 1.2rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.7rem;
`;

const Tag = styled.span`
  background-color: rgba(162, 89, 255, 0.3);
  color: #ff00ff;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  text-shadow: 0 0 5px #ff00ff;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(162, 89, 255, 0.5);
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
  }
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
  };
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isHeaderExpanded: boolean;
}

/**
 * LatestBlogPosts component
 * Renders a sidebar or section displaying the latest blog posts.
 * @param {LatestBlogPostsProps} props - The component props
 * @returns {JSX.Element} Rendered latest blog posts component
 */
const LatestBlogPosts: React.FC<LatestBlogPostsProps> = ({
  posts,
  isCollapsed,
  onToggle,
  isMobile,
  isHeaderExpanded,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (!isCollapsed || isMobile) {
      controls.start((i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1 },
      }));
    }
  }, [controls, isCollapsed, isMobile]);

  return (
    <SidebarContainer
      initial={{ x: isMobile ? 0 : 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      $isCollapsed={isCollapsed}
      $isMobile={isMobile}
      $isHeaderExpanded={isHeaderExpanded}
    >
      {!isMobile && (
        <ToggleButton onClick={onToggle}>
          {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
        </ToggleButton>
      )}
      {(!isCollapsed || isMobile) && (
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
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 0 30px rgba(0, 255, 255, 0.6), 0 0 50px rgba(255, 0, 255, 0.4)",
                    borderColor: "#00ffff",
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <PostTitle $isMobile={isMobile}>
                    {post.frontmatter.title}
                  </PostTitle>
                  <PostMeta>
                    <MetaItem>
                      <FaUser />
                      {post.frontmatter.author}
                    </MetaItem>
                    <MetaItem>
                      <FaCalendarAlt />
                      {new Date(post.frontmatter.date).toLocaleDateString()}
                    </MetaItem>
                  </PostMeta>
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
                  <HoverIcon className="hover-icon" />
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
      )}
    </SidebarContainer>
  );
};

export default LatestBlogPosts;
