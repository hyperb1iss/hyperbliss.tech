// app/components/ProjectCard.tsx
import { motion } from "framer-motion";
import styled from "styled-components";
import StyledLink from "./StyledLink"; // Import the StyledLink component

/**
 * ProjectTitle component
 * Styles the project title with a prominent color and shadow.
 */
const ProjectTitle = styled.h2`
  font-size: 2.0rem;
  color: #00ffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px #00ffff;
`;

/**
 * Author component
 * Styles the author information.
 */
const Author = styled.div`
  font-size: 1.2rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
`;

/**
 * ProjectDescription component
 * Styles the project description text.
 */
const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  line-height: 1.2;
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
  margin-bottom: 1rem; // Add some space between tags and description
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
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: rgba(162, 89, 255, 0.4);
    color: #ffffff;
  }
`;

/**
 * ProjectCardProps interface
 * Defines the properties expected by the ProjectCard component.
 */
interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  github: string;
  author?: string;
  tags?: string[];
  index: number; // Required prop
}

/**
 * ProjectCard component
 * Renders a single project card with title, description, author, tags, and links.
 * Includes a glow effect and subtle scaling on hover.
 * @param {ProjectCardProps} props - The component props
 * @returns {JSX.Element} Rendered project card
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  author,
  tags,
  index,
}) => {
  return (
    <StyledLink href={`/projects/${slug}`}>
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
        <ProjectTitle>{title}</ProjectTitle>
        {author && <Author>Author: {author}</Author>}
        {tags && tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
        <ProjectDescription>{description}</ProjectDescription>
      </motion.div>
    </StyledLink>
  );
};
