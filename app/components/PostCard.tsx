// app/components/PostCard.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 255, 255, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  color: var(--color-accent);
  &:hover {
    text-decoration: underline;
  }
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

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

/**
 * PostCard component
 * Renders a single blog post card with title, date, and excerpt.
 * @param {PostCardProps} props - The component props
 * @returns {JSX.Element} Rendered post card
 */
export const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  date,
  excerpt,
}) => {
  return (
    <Card
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Title>
        <StyledLink href={`/blog/${slug}`}>{title}</StyledLink>
      </Title>
      <Meta>{new Date(date).toLocaleDateString()}</Meta>
      <Excerpt>{excerpt}</Excerpt>
    </Card>
  );
};
