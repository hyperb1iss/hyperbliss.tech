// app/components/ResumePageContent.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import { FiDownload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

// Styled components for resume content
const ResumeContainer = styled(motion.div)`
  position: relative;
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const ResumeContent = styled(ReactMarkdown)`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  line-height: 1.6;
  color: var(--color-text);

  h1 {
    font-size: clamp(3rem, 4vw, 5rem);
    color: var(--color-primary);
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 10px var(--color-primary);
  }

  /* Center the first two paragraphs (tagline and links) */
  & > p:nth-of-type(1),
  & > p:nth-of-type(2) {
    text-align: center;
  }

  h2 {
    font-size: clamp(2.4rem, 3vw, 4rem);
    color: var(--color-secondary);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: 0.5rem;
    text-shadow: 0 0 5px var(--color-secondary);
  }

  h3 {
    font-size: clamp(2rem, 2.5vw, 3.5rem);
    color: var(--color-accent);
    margin-top: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 5px var(--color-accent);
  }

  h4 {
    font-size: clamp(1.8rem, 2vw, 3rem);
    color: var(--color-text);
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style-type: none;
    margin-left: 0;
    padding-left: 0;
  }

  li {
    margin-bottom: 0.75rem;
    position: relative;
    padding-left: 1.5rem;

    &::before {
      content: "▹";
      position: absolute;
      left: 0;
      color: var(--color-accent);
    }
  }

  a {
    color: var(--color-link);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    padding-bottom: 1px;

    &:hover {
      color: var(--color-secondary);
      border-bottom: 2px solid var(--color-secondary);
      text-shadow: 0px 0px 8px var(--color-secondary);
      text-decoration: none;
    }

    &:active {
      color: var(--color-primary);
    }
  }

  p {
    margin-bottom: 1.5rem;
  }

  strong {
    color: var(--color-secondary);
  }
`;

// Styled component for the download button
const DownloadButton = styled.a`
  position: absolute;
  top: -7rem;
  right: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  background: rgba(0, 255, 255, 0.1);
  color: var(--color-accent);
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  text-decoration: none;
  transition: all 0.3s ease;
  z-index: 10;

  svg {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    background: rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    transform: translateY(-2px) scale(1.05);
  }

  @media (max-width: 768px) {
    top: -6rem;
    right: 1.5rem;
    width: 4rem;
    height: 4rem;

    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`;

// Interface for ResumePageContent component props
interface ResumePageContentProps {
  content: string;
}

/**
 * ResumePageContent component
 * Renders the resume content with styling and animations.
 * Adjusted layout to be wider and font sizes to be consistent across widescreens.
 * @param {ResumePageContentProps} props - The component props
 * @returns {JSX.Element} Rendered resume page
 */
const ResumePageContent: React.FC<ResumePageContentProps> = ({ content }) => {
  return (
    <PageLayout>
      <PageTitle>Resume</PageTitle>
      <ResumeContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DownloadButton
          href="/resume.pdf"
          download
          aria-label="Download Resume as PDF"
          title="Download Resume as PDF"
        >
          <FiDownload />
        </DownloadButton>
        <ResumeContent>{content}</ResumeContent>
      </ResumeContainer>
    </PageLayout>
  );
};

export default ResumePageContent;
