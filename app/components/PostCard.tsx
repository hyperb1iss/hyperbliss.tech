// app/components/PostCard.tsx
import { motion } from "framer-motion";
import styled from "styled-components";
import StyledLink from "./StyledLink"; // Import the StyledLink component

/**
 * Title component
 * Styles the post title with a prominent color and shadow.
 */
const Title = styled.h2`
  font-size: 2.4rem;
  color: #ff00ff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px #ff00ff;
`;

/**
 * DateAuthor component
 * Styles the date and author information.
 */
const DateAuthor = styled.div`
  font-size: 1.2rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
`;

/**
 * Excerpt component
 * Styles the excerpt text of the post.
 */
const Excerpt = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-text);
`;

/**
 * TagsContainer component
 * Styles the container holding the tags.
 */
const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

/**
 * Tag component
 * Styles individual tags with interactivity.
 */
const Tag = styled.span`
  background-color: rgba(162, 89, 255, 0.2);
  color: var(--color-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-shadow: 0 0 5px var(--color-primary);
  cursor: pointer; /* Show hover cursor */
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: rgba(162, 89, 255, 0.4);
    color: #ffffff;
  }
`;

/**
 * PostCardProps interface
 * Defines the properties expected by the PostCard component.
 */
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
 * Includes a glow effect and subtle scaling on hover.
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
          scale: 1.02,
          transition: {
            delay: index * 0.05,
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        <Title>{title}</Title>
        <DateAuthor>
          {new Date(date).toLocaleDateString()} • {author}
        </DateAuthor>
        {tags && tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
        <Excerpt>{excerpt}</Excerpt>
      </motion.div>
    </StyledLink>
  );
};
