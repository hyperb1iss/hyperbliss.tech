// app/components/LatestBlogPosts.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import GlitchSpan from "./GlitchSpan";
import StyledTitle from "./StyledTitle";
import Card from "./Card";

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
      setMaxHeight(0);
      setTimeout(() => {
        const cards = document.querySelectorAll(".blog-post-card");
        let maxCardHeight = 0;
        cards.forEach((card) => {
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
  }, [posts, isMobile]);

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
          posts.map((post, index) => (
            <Card
              key={post.slug}
              title={post.frontmatter.title}
              description={post.frontmatter.excerpt}
              link={`/blog/${post.slug}`}
              color="255, 0, 255"
              tags={post.frontmatter.tags}
              meta={new Date(post.frontmatter.date).toLocaleDateString()}
              index={index}
              className="blog-post-card"
              style={{ height: maxHeight > 0 ? `${maxHeight}px` : "auto" }}
            />
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
