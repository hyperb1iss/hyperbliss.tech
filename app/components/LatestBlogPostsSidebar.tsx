// app/components/LatestBlogPostsSidebar.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";
import { useEffect } from "react";
import { FaChevronRight, FaChevronLeft, FaArrowRight } from "react-icons/fa";

const SidebarContainer = styled(motion.div)<{ $isCollapsed: boolean; $isMobile: boolean }>`
  ${props => props.$isMobile ? `
    position: relative;
    width: 100%;
    max-width: 100%;
    background: none;
    border-left: none;
    padding: 2rem;
    overflow-y: visible;
    max-height: none;
  ` : `
    position: fixed;
    top: var(--header-height, 100px);
    right: 0;
    width: ${props.$isCollapsed ? "40px" : "300px"};
    background: linear-gradient(
      135deg,
      rgba(10, 10, 20, 0.8) 0%,
      rgba(30, 30, 60, 0.8) 100%
    );
    border-left: 1px solid rgba(0, 255, 255, 0.2);
    padding: ${props.$isCollapsed ? "1rem 0" : "2rem"};
    overflow-y: auto;
    transition: width 0.3s ease;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 255, 0.5) rgba(10, 10, 20, 0.8);
    z-index: 1000;
    max-height: calc(
      100vh - var(--header-height, 100px) - var(--footer-height, 0px)
    );
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
  top: 10px;
  left: 10px;
  background: rgba(0, 255, 255, 0.2);
  border: none;
  color: #00ffff;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.4);
  }
`;

const SidebarContent = styled(motion.div)<{ $isMobile: boolean }>`
  display: ${props => props.$isMobile ? 'grid' : 'flex'};
  flex-direction: ${props => props.$isMobile ? 'unset' : 'column'};
  grid-template-columns: ${props => props.$isMobile ? 'repeat(2, 1fr)' : 'unset'};
  gap: 1.5rem;
`;

const SidebarTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #00ffff;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  text-align: center;
  letter-spacing: 2px;
  font-family: var(--font-heading);
  grid-column: 1 / -1; // Span across all columns in grid layout
`;

const BlogPostCard = styled(motion.div)<{ $isMobile: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: ${props => props.$isMobile ? '0' : '1.5rem'};
  cursor: pointer;
  height: ${props => props.$isMobile ? '250px' : 'auto'};
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 3px 10px rgba(0, 255, 255, 0.3);

    &::before {
      opacity: 1;
    }

    .hover-icon {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const PostTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${props => props.$isMobile ? '1.4rem' : '1.6rem'};
  color: #ff00ff;
  margin-bottom: 0.6rem;
  text-shadow: 0 0 5px #ff00ff;
  font-family: var(--font-heading);
`;

const PostExcerpt = styled.p<{ $isMobile: boolean }>`
  font-size: ${props => props.$isMobile ? '1rem' : '1.2rem'};
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.5;
  opacity: 0.9;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ReadMoreLink = styled.span<{ $isMobile: boolean }>`
  font-size: ${props => props.$isMobile ? '1rem' : '1.2rem'};
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
  bottom: 10px;
  right: 10px;
  background: rgba(255, 0, 255, 0.2);
  color: #ff00ff;
  padding: ${props => props.$isMobile ? '0.2rem 0.4rem' : '0.3rem 0.6rem'};
  border-radius: 12px;
  font-size: ${props => props.$isMobile ? '0.8rem' : '1rem'};
  text-shadow: 0 0 3px #ff00ff;
`;

const HoverIcon = styled(FaArrowRight)`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%) translateX(20px);
  opacity: 0;
  transition: all 0.3s ease;
  color: #00ffff;
  font-size: 1.8rem;
`;

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
  };
}

interface LatestBlogPostsSidebarProps {
  posts: BlogPost[];
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const LatestBlogPostsSidebar: React.FC<LatestBlogPostsSidebarProps> = ({
  posts,
  isCollapsed,
  onToggle,
  isMobile,
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

    if (!isMobile) {
      // Add this effect to update CSS variables
      const updateSidebarHeight = () => {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        if (header) {
          document.documentElement.style.setProperty(
            "--header-height",
            `${header.offsetHeight}px`
          );
        }
        if (footer) {
          document.documentElement.style.setProperty(
            "--footer-height",
            `${footer.offsetHeight}px`
          );
        }
      };

      updateSidebarHeight();
      window.addEventListener("resize", updateSidebarHeight);

      return () => {
        window.removeEventListener("resize", updateSidebarHeight);
      };
    }
  }, [controls, isCollapsed, isMobile]);

  return (
    <SidebarContainer
      initial={{ x: isMobile ? 0 : 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      $isCollapsed={isCollapsed}
      $isMobile={isMobile}
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
          <SidebarTitle
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Latest Posts
          </SidebarTitle>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} passHref>
                <BlogPostCard
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  $isMobile={isMobile}
                >
                  <PostTitle $isMobile={isMobile}>{post.frontmatter.title}</PostTitle>
                  <PostExcerpt $isMobile={isMobile}>{post.frontmatter.excerpt}</PostExcerpt>
                  <ReadMoreLink $isMobile={isMobile}>
                    Read More <FaChevronRight style={{ marginLeft: '5px' }} />
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

export default LatestBlogPostsSidebar;