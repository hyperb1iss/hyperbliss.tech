// app/components/ProjectCard.tsx
import { motion } from "framer-motion";
import styled from "styled-components";
import StyledLink from "./StyledLink"; // Import the StyledLink component

const ProjectTitle = styled.h2`
  font-size: 2.4rem;
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 7px #00ffff;
`;

const Meta = styled.div`
  font-size: 1.4rem;
  color: var(--color-muted);
  margin-bottom: 1rem;

  span {
    margin: 0 0.5rem;
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  font-size: 1.6rem;
  color: #ff00ff;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: #00ffff;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Props interface for ProjectCard component
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
 * Enhanced animations and aesthetics to fix flickering and fit the theme.
 * @param {ProjectCardProps} props - The component props
 * @returns {JSX.Element} Rendered project card
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  github,
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
          scale: 1.05,
          rotate: index % 2 === 0 ? 2 : -2, // Slight rotation based on index
          transition: {
            delay: index * 0.05, // 50ms delay per index
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        <ProjectTitle>{title}</ProjectTitle>
        <Meta>
          {author && <span>Author: {author}</span>}
          {tags && tags.length > 0 && <span>Tags: {tags.join(", ")}</span>}
        </Meta>
        <ProjectDescription>{description}</ProjectDescription>
        <ProjectLinks>
          <ProjectLink href={`/projects/${slug}`}>Learn More</ProjectLink>
          <ProjectLink href={github} target="_blank" rel="noopener noreferrer">
            GitHub
          </ProjectLink>
        </ProjectLinks>
      </motion.div>
    </StyledLink>
  );
};
