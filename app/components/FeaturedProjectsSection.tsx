// app/components/FeaturedProjectsSection.tsx
"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";
import { FaGithub, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SectionContainer = styled.section`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: linear-gradient(
    135deg,
    rgba(10, 10, 20, 0.9) 0%,
    rgba(30, 30, 60, 0.9) 100%
  );
  padding: 4rem 0;
  overflow: hidden;
`;

const InnerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  color: #ff00ff;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin: 0 1rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 5px 20px rgba(0, 255, 255, 0.4);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 2.2rem;
  color: #00ffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px #00ffff;
`;

const ProjectDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectLink = styled(Link)`
  font-size: 1.6rem;
  color: #ff00ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }

  svg {
    margin-left: 5px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const GithubLink = styled.a`
  font-size: 2rem;
  color: #ff00ff;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }
`;

const StyledSlider = styled(Slider)`
  .slick-slide > div {
    margin: 0 15px;
  }
  .slick-list {
    margin: 0 -15px;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: #00ffff;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    color: #ff00ff;
    text-shadow: 0 0 5px #ff00ff;
  }

  &.prev {
    left: -40px;
  }

  &.next {
    right: -40px;
  }
`;

interface Project {
  slug: string;
  title: string;
  description: string;
  github: string;
}

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects,
}) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    prevArrow: (
      <ArrowButton className="prev">
        <FaChevronLeft />
      </ArrowButton>
    ),
    nextArrow: (
      <ArrowButton className="next">
        <FaChevronRight />
      </ArrowButton>
    ),
  };

  return (
    <SectionContainer>
      <InnerContainer>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </SectionTitle>
        <StyledSlider {...sliderSettings}>
          {projects.map((project) => (
            <ProjectCard key={project.slug}>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ProjectLinks>
                <ProjectLink href={`/projects/${project.slug}`}>
                  Learn More
                  <FaChevronRight />
                </ProjectLink>
                <GithubLink
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </GithubLink>
              </ProjectLinks>
            </ProjectCard>
          ))}
        </StyledSlider>
      </InnerContainer>
    </SectionContainer>
  );
};

export default FeaturedProjectsSection;
