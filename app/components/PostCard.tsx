// app/components/PostCard.tsx
import { motion } from "framer-motion";
import styled from "styled-components";
import StyledLink from "./StyledLink"; // Import the StyledLink component

const Title = styled.h2`
  font-size: 2.4rem;
  color: #ff00ff;
  margin-bottom: 1rem;
  text-shadow: 0 0 7px #ff00ff;
`;

const Meta = styled.div`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 1rem;

  span {
    margin: 0 0.5rem;
  }
`;

const Excerpt = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-text);
`;

// Props interface for PostCard component
interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
  index: number; // Required prop
}

/**
 * PostCard component
 * Renders a single blog post card with title, date, author, tags, and excerpt.
 * Enhanced animations to fix flickering and improved cyberpunk aesthetics.
 * @param {PostCardProps} props - The component props
 * @returns {JSX.Element} Rendered post card
 */
export const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  date,
  excerpt,
  author,
  tags,
  index,
}) => {
  return (
    <StyledLink href={`/blog/${slug}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.05,
          rotate: index % 2 === 0 ? 2 : -2, // Slight rotation based on index
          transition: {
            delay: index * 0.05, // 50ms delay per index
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        <Title>{title}</Title>
        <Meta>
          {new Date(date).toLocaleDateString()}
          {author && <span>• {author}</span>}
          {tags && tags.length > 0 && <span>• Tags: {tags.join(", ")}</span>}
        </Meta>
        <Excerpt>{excerpt}</Excerpt>
      </motion.div>
    </StyledLink>
  );
};
