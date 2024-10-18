// app/components/Card.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { FaArrowRight, FaGithub } from "react-icons/fa";

const CardWrapper = styled(motion.div)<{ $color: string }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${(props) => `rgba(${props.$color}, 0.2)`};
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 0 10px ${(props) => `rgba(${props.$color}, 0.3)`}; // Add glow effect at rest

  &:hover {
    box-shadow: 0 0 20px ${(props) => `rgba(${props.$color}, 0.6)`},
      0 0 40px ${(props) => `rgba(${props.$color}, 0.4)`};
    transform: translateY(-5px);
    border-color: ${(props) => `rgb(${props.$color})`};

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
      ${(props) => `rgba(${props.$color}, 0.1)`} 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @media (min-width: 1200px) {
    font-size: 0.95em;
  }
`;

const CardTitle = styled.h3<{ $color: string }>`
  font-size: clamp(1.8rem, 2vw, 2.4em);
  color: rgb(${(props) => props.$color});
  margin-bottom: 0.5rem;
  text-shadow: 0 0 7px rgb(${(props) => props.$color});

  @media (min-width: 1200px) {
    font-size: clamp(1.7rem, 1.8vw, 2.2rem);
  }
`;

const CardMeta = styled.div`
  font-size: clamp(1.2rem, 1.4vw, 1.6rem);
  color: var(--color-muted);
  margin-bottom: 0.5rem;

  @media (min-width: 1200px) {
    font-size: clamp(1.1rem, 1.3vw, 1.5rem);
  }
`;

const CardDescription = styled.p`
  font-size: clamp(1.4rem, 1.5vw, 1.8rem);
  color: var(--color-text);
  margin-bottom: 1.5rem;
  flex-grow: 1;

  @media (min-width: 1200px) {
    font-size: clamp(1.3rem, 1.4vw, 1.7rem);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span<{ $color: string }>`
  background: ${(props) => `rgba(${props.$color}, 0.1)`};
  color: rgb(${(props) => props.$color});
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: clamp(1.2rem, 1.2vw, 1.4rem);
  text-shadow: 0 0 3px rgb(${(props) => props.$color});

  @media (min-width: 1200px) {
    font-size: clamp(1.1rem, 1.1vw, 1.3rem);
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CardLink = styled.div<{ $color: string }>`
  font-size: clamp(1.4rem, 1.4vw, 1.6rem);
  color: #00ffff; // Change color to cyan
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    color: #ff00ff; // Change hover color to magenta
    text-shadow: 0 0 5px #ff00ff;
  }

  @media (min-width: 1200px) {
    font-size: clamp(1.3rem, 1.3vw, 1.5rem);
  }
`;

const GithubLink = styled(CardLink)`
  color: #00ffff; // Change color to cyan

  &:hover {
    color: #ff00ff; // Change hover color to magenta
    text-shadow: 0 0 5px #ff00ff;
  }
`;

interface CardProps {
  title: string;
  description: string;
  link: string;
  color?: string;
  tags?: string[];
  meta?: string;
  linkText?: string;
  githubLink?: string;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  link,
  color = "0, 255, 255",
  tags,
  meta,
  linkText = "Read More",
  githubLink,
  index,
  className,
  style,
}) => {
  return (
    <Link href={link} passHref>
      <CardWrapper
        $color={color}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
        }}
        whileHover={{ scale: 1.03 }}
        className={className}
        style={style}
      >
        <div>
          <CardTitle $color={color}>{title}</CardTitle>
          {meta && <CardMeta>{meta}</CardMeta>}
          <CardDescription>{description}</CardDescription>
          {tags && tags.length > 0 && (
            <TagsContainer>
              {tags.map((tag) => (
                <Tag key={tag} $color={color}>
                  {tag}
                </Tag>
              ))}
            </TagsContainer>
          )}
        </div>
        <CardFooter>
          <CardLink $color={color}>
            {linkText} <FaArrowRight style={{ marginLeft: "5px" }} />
          </CardLink>
          {githubLink && (
            <GithubLink
              as="a"
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              $color={color}
            >
              <FaGithub />
            </GithubLink>
          )}
        </CardFooter>
      </CardWrapper>
    </Link>
  );
};

export default Card;
