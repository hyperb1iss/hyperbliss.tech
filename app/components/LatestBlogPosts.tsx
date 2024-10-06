// app/components/LatestBlogPosts.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    position: fixed;
    top: ${
      props.$isHeaderExpanded ? "200px" : "100px"
    }; // Adjust based on header expansion
    right: 0;
    bottom: 0;
    width: ${props.$isCollapsed ? "40px" : "300px"};
    background: linear-gradient(
      135deg,
      rgba(10, 10, 20, 0.8) 0%,
      rgba(30, 30, 60, 0.8) 100%
    );
    border-left: 1px solid rgba(0, 255, 255, 0.2);
    padding: ${props.$isCollapsed ? "1rem 0" : "2rem"};
    overflow-y: auto;
    transition: width 0.3s ease, top 0.3s ease;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 255, 0.5) rgba(10, 10, 20, 0.8);
    z-index: 1000;
    max-height: calc(100vh - ${props.$isHeaderExpanded ? "200px" : "100px"});
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
  padding: 1.2rem;
  position: relative;
  overflow: hidden;
  margin-bottom: ${(props) => (props.$isMobile ? "0" : "0.8rem")};
  cursor: pointer;
  height: ${(props) => (props.$isMobile ? "auto" : "auto")};
  min-height: ${(props) => (props.$isMobile ? "220px" : "auto")};
  display: flex;
  flex-direction: column;

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
  margin-bottom: 0.6rem;
  text-shadow: 0 0 5px #ff00ff;
  font-family: var(--font-heading);
`;

const PostExcerpt = styled.p<{ $isMobile: boolean }>`
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 0.4rem;
  line-height: 1.4;
  opacity: 0.9;
  flex-grow: 1;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ReadMoreLink = styled.span<{ $isMobile: boolean }>`
  font-size: 1.3rem;
  color: #00ffff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  width: fit-content;

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
  font-size: 1.1rem;
  text-shadow: 0 0 3px #ff00ff;
`;

const HoverIcon = styled(FaArrowRight)``;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
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
                    scale: 1.03,
                    boxShadow:
                      "0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)",
                    borderColor: "#00ffff",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <PostTitle $isMobile={isMobile}>
                    {post.frontmatter.title}
                  </PostTitle>
                  <PostExcerpt $isMobile={isMobile}>
                    {post.frontmatter.excerpt}
                  </PostExcerpt>
                  <ReadMoreLink $isMobile={isMobile}>
                    Read More <FaChevronRight style={{ marginLeft: "5px" }} />
                  </ReadMoreLink>
                  <DateTag $isMobile={isMobile}>
                    {new Date(post.frontmatter.date).toLocaleDateString()}
                  </DateTag>
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
