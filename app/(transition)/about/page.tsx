"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1000px;
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImage = styled(motion.img)`
  width: 200px;
  height: 250px; /* Oval shape */
  border-radius: 50% / 40%; /* Oval shape */
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

const Title = styled(motion.h1)`
  font-size: 4.8rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 5px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 3.6rem;
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

const About: React.FC = () => {
  return (
    <PageContainer>
      <MainContent>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          About Me
        </Title>
        <ContentWrapper
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <ProfileImage
            src="/images/profile-image.jpg"
            alt="Profile image of Stefanie Jane"
            initial={{ opacity: 0, scale: 0.95 }} /* Reduced initial scale */
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6 /* Shorter duration */,
              ease: [0.25, 0.46, 0.45, 0.94] /* Smooth easing curve */,
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
              interfaces, crafting intuitive user experiences, or diving into
              the latest tech trends, I&apos;m all about blending technology
              with creativity.
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
      </MainContent>
    </PageContainer>
  );
};

export default About;
