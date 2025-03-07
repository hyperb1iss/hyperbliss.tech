// app/components/Card.tsx
import { motion } from "framer-motion";
import React from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa6";
import styled from "styled-components";

const CardWrapper = styled.div<{ $color: string }>`
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(5px);
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
  box-shadow: 0 0 10px ${(props) => `rgba(${props.$color}, 0.3)`};

  &:hover {
    box-shadow:
      0 0 20px ${(props) => `rgba(${props.$color}, 0.6)`},
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

const CardMeta = styled.div<{ $color: string }>`
  font-size: clamp(1.2rem, 1.4vw, 1.6rem);
  font-weight: 650;
  color: rgb(${(props) => props.$color});
  margin-bottom: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: rgba(${(props) => props.$color}, 0.15);
  border-left: 3px solid rgb(${(props) => props.$color});
  border-radius: 0 5px 5px 0;
  display: inline-block;
  text-shadow: 0 0 3px rgba(${(props) => props.$color}, 0.5);
  box-shadow: 0 0 5px rgba(${(props) => props.$color}, 0.2);

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

const ClickableArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const CardLink = styled.button<{ $color: string }>`
  font-size: clamp(1.4rem, 1.4vw, 1.6rem);
  font-family: inherit;
  color: rgb(${(props) => props.$color});
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  border-radius: 8px;
  text-shadow: 0 0 5px rgba(${(props) => props.$color}, 0.5);

  &:hover {
    color: rgb(${(props) => props.$color});
    background: rgba(${(props) => props.$color}, 0.1);
    text-shadow: 0 0 8px rgba(${(props) => props.$color}, 0.8);
    box-shadow: 0 0 15px rgba(${(props) => props.$color}, 0.3);
  }

  @media (min-width: 1200px) {
    font-size: clamp(1.3rem, 1.3vw, 1.5rem);
  }
`;

const GithubLink = styled.a<{ $color: string }>`
  color: rgb(${(props) => props.$color});
  z-index: 2;
  position: relative;
  font-size: clamp(1.8rem, 1.8vw, 2rem);
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: rgb(${(props) => props.$color});
    background: rgba(${(props) => props.$color}, 0.1);
    text-shadow: 0 0 8px rgba(${(props) => props.$color}, 0.8);
    box-shadow: 0 0 15px rgba(${(props) => props.$color}, 0.3);
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

interface CardProps {
  title: string;
  description: string;
  link: string;
  color?: string;
  linkColor?: string;
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
  linkColor,
  tags,
  meta,
  linkText = "Read More",
  githubLink,
  index,
  className,
  style,
}) => {
  const finalLinkColor = linkColor || color;

  const handleMainClick = (e: React.MouseEvent) => {
    // Prevent click if it's on a button or anchor
    if (e.target instanceof HTMLElement && (e.target.closest("button") || e.target.closest("a"))) {
      return;
    }
    window.location.href = link;
  };

  return (
    <CardWrapper $color={color} className={className} style={style}>
      <ClickableArea onClick={handleMainClick} />
      <motion.div
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
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardContent>
          <CardTitle $color={color}>{title}</CardTitle>
          {meta && <CardMeta $color={color}>{meta}</CardMeta>}
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
        </CardContent>
        <CardFooter>
          <CardLink
            $color={finalLinkColor}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = link;
            }}
          >
            {linkText} <FaArrowRight style={{ marginLeft: "5px" }} />
          </CardLink>
          {githubLink && (
            <GithubLink
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              $color={finalLinkColor}
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub />
            </GithubLink>
          )}
        </CardFooter>
      </motion.div>
    </CardWrapper>
  );
};

export default Card;
