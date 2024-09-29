// app/components/PostCard.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";

// Styled components for the post card
const Card = styled(motion.a)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 255, 0.2),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const Title = styled.h2`
  font-size: 2.4rem;
  color: #ff00ff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px #ff00ff;
`;

const Meta = styled.div`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 1rem;
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
  index: number;
}

/**
 * PostCard component
 * Renders a single blog post card with title, date, and excerpt.
 * The entire card is now clickable.
 * @param {PostCardProps} props - The component props
 * @returns {JSX.Element} Rendered post card
 */
export const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  date,
  excerpt,
  index,
}) => {
  return (
    <Link href={`/blog/${slug}`} passHref>
      <Card
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
      >
        <Title>{title}</Title>
        <Meta>{new Date(date).toLocaleDateString()}</Meta>
        <Excerpt>{excerpt}</Excerpt>
      </Card>
    </Link>
  );
};
