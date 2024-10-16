// app/components/LatestBlogPosts.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
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

const BlogPostCard = styled(motion.div)<{
  $isMobile: boolean;
  $height: number;
}>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(5px);
  overflow: hidden;
  margin-bottom: ${(props) => (props.$isMobile ? "0" : "0.8rem")};
  cursor: pointer;
  height: ${(props) => (props.$height ? `${props.$height}px` : "auto")};
  min-height: ${(props) => (props.$isMobile ? "220px" : "auto")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4);
    transform: translateY(-5px);
    border-color: #00ffff;

    &::before {
      opacity: 1;
    }
  }

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
    transition: opacity 0.3s ease;
  }
`;

const PostContent = styled.div`
  flex-grow: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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
`;

const ReadMoreLink = styled.span<{ $isMobile: boolean }>`
  font-size: 1.4rem;
  color: #00ffff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 5px #ff00ff;
  }
`;

const DateTag = styled.span<{ $isMobile: boolean }>`
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
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    const updateMaxHeight = () => {
      // Reset the maxHeight to 0 before recalculating
      setMaxHeight(0);

      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        const cards = document.querySelectorAll(".blog-post-card");
        let maxCardHeight = 0;
        cards.forEach((card) => {
          // Reset the height to auto before measuring
          (card as HTMLElement).style.height = "auto";
          const cardHeight = card.getBoundingClientRect().height;
          if (cardHeight > maxCardHeight) {
            maxCardHeight = cardHeight;
          }
        });
        setMaxHeight(maxCardHeight);
      }, 0);
    };

    updateMaxHeight();

    // Debounce the resize event
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMaxHeight, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [posts, isMobile]); // Add isMobile to the dependency array

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
                className="blog-post-card"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                $isMobile={isMobile}
                $height={maxHeight}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <PostContent>
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
                </PostContent>
                <CardFooter>
                  <ReadMoreLink $isMobile={isMobile}>
                    Read More <FaChevronRight style={{ marginLeft: "5px" }} />
                  </ReadMoreLink>
                  <DateTag $isMobile={isMobile}>
                    {new Date(post.frontmatter.date).toLocaleDateString()}
                  </DateTag>
                </CardFooter>
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
