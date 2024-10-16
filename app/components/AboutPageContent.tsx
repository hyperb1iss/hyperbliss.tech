// app/components/AboutPageContent.tsx

import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";

// Styled components for the About page
const ContentWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImage = styled(motion.img)`
  width: clamp(200px, 20vw, 400px);
  height: auto;
  border-radius: 50% / 40%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin-right: 2rem;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 2rem;
  }
`;

const TextContent = styled(motion.div)`
  width: 75%;
  text-align: justify;

  p {
    font-size: clamp(1.6rem, 2vw, 2.4rem);
    line-height: 1.6;
    color: var(--color-text);
    margin-bottom: 2rem;

    &:first-of-type {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    width: 90%;
    text-align: center;

    p {
      font-size: 1.6rem;
    }
  }
`;

const Highlight = styled.span`
  color: var(--color-accent);
  font-weight: bold;
`;

// Variants for staggered animations
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * AboutPageContent component
 * Renders the content for the About page, including a profile image and text.
 * Adjusted styling for better widescreen support and responsiveness.
 */
const AboutPageContent: React.FC = () => {
  return (
    <PageLayout>
      <PageTitle>About Me</PageTitle>
      <ContentWrapper
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <ProfileImage
            src="/images/profile-image.jpg"
            alt="Profile image of Stefanie Jane"
            whileHover={{ scale: 1.05 }}
          />
        </motion.div>
        <TextContent>
          <motion.div variants={itemVariants}>
            <p>
              Hey there! I&apos;m <Highlight>Stefanie Jane</Highlight>, but you
              might know me as <Highlight>@hyperb1iss</Highlight> in the tech
              world. I&apos;m a full-stack developer and designer with a passion
              for creating innovative software solutions that make a difference.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p>
              I believe in the power of technology to transform lives, and
              I&apos;m always exploring new ways to push the boundaries of
              what&apos;s possible. Whether it&apos;s developing sleek user
              interfaces, crafting intuitive user experiences, or diving into
              the latest tech trends, I&apos;m all about blending technology
              with creativity.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p>
              When I&apos;m not coding or designing, you can find me sharing
              insights on my blog, contributing to open-source projects, or
              connecting with the tech community. I&apos;m an avid learner,
              constantly seeking new knowledge and skills to stay ahead in this
              ever-evolving field.
            </p>
          </motion.div>
        </TextContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default AboutPageContent;
