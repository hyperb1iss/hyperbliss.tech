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
  width: 200px;
  height: 250px;
  border-radius: 50% / 40%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin-right: 20px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const TextContent = styled(motion.div)`
  max-width: 600px;
  text-align: justify;

  p {
    font-size: 1.8rem;
    line-height: 1.6;
    color: var(--color-text);
    margin-bottom: 2rem;

    &:first-of-type {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
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

/**
 * AboutPageContent component
 * Renders the content for the About page, including a profile image and text.
 */
const AboutPageContent: React.FC = () => {
  return (
    <PageLayout>
      <PageTitle>About Me</PageTitle>
      <ContentWrapper
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <ProfileImage
          src="/images/profile-image.jpg"
          alt="Profile image of Stefanie Jane"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
          }}
          whileHover={{ scale: 1.05 }}
        />
        <TextContent
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <p>
            Hey there! I&apos;m <Highlight>Stefanie Jane</Highlight>, but you
            might know me as <Highlight>@hyperb1iss</Highlight> in the tech
            world. I&apos;m a full-stack developer and designer with a passion
            for creating innovative software solutions that make a difference.
          </p>
          <p>
            I believe in the power of technology to transform lives, and
            I&apos;m always exploring new ways to push the boundaries of
            what&apos;s possible. Whether it&apos;s developing sleek user
            interfaces, crafting intuitive user experiences, or diving into the
            latest tech trends, I&apos;m all about blending technology with
            creativity.
          </p>
          <p>
            When I&apos;m not coding or designing, you can find me sharing
            insights on my blog, contributing to open-source projects, or
            connecting with the tech community. I&apos;m an avid learner,
            constantly seeking new knowledge and skills to stay ahead in this
            ever-evolving field.
          </p>
        </TextContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default AboutPageContent;
