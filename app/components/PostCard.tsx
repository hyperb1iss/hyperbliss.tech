// app/components/PostCard.tsx
import { motion } from "framer-motion";
import styled from "styled-components";
import StyledLink from "./StyledLink";

/**
 * MotionLink component
 * Extends the StyledLink component with motion capabilities.
 */
const MotionLink = motion(StyledLink);

/**
 * CardWrapper component
 * Combines the link and card styling into one component.
 * Now the link itself is the card, avoiding unnecessary nesting.
 */
const CardWrapper = styled(MotionLink)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2);
  }
`;

/**
 * Title component
 * Styles the post title with a prominent color and shadow.
 */
const Title = styled.h2`
  font-size: clamp(2rem, 2vw, 2.4rem);
  color: #ff00ff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px #ff00ff;
`;

/**
 * DateAuthor component
 * Styles the date and author information to make them pop.
 */
const DateAuthor = styled.div`
  font-size: clamp(1.4rem, 1.5vw, 1.8rem);
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: bold;
  background: rgba(0, 255, 255, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  display: inline-block;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
`;

/**
 * Excerpt component
 * Styles the excerpt text of the post.
 */
const Excerpt = styled.p`
  font-size: clamp(1.6rem, 1.5vw, 2rem);
  line-height: 1.2;
  color: var(--color-text);
  padding-top: 1rem;
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
  font-size: clamp(1.2rem, 1.2vw, 1.6rem);
  text-shadow: 0 0 5px var(--color-primary);
  cursor: pointer;
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
 * Adjusted to avoid unnecessary nesting and ensure the card fills the space correctly.
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
    <CardWrapper
      href={`/blog/${slug}`}
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
    </CardWrapper>
  );
};
