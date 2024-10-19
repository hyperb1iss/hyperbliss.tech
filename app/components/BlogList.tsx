// app/components/BlogList.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Card from "./Card";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

const PostList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
`;

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    tags?: string[];
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
        {posts.map(({ slug, frontmatter }, index) => (
          <Card
            key={slug}
            title={frontmatter.title}
            description={frontmatter.excerpt}
            link={`/blog/${slug}`}
            color="255, 0, 255"
            linkColor="0, 255, 255"
            tags={frontmatter.tags}
            meta={`${new Date(frontmatter.date).toLocaleDateString()} ${
              frontmatter.author ? `• ${frontmatter.author}` : ""
            }`}
            linkText="Read More"
            index={index}
          />
        ))}
      </PostList>
    </PageLayout>
  );
}
