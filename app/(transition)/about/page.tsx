// app/(transition)/about/page.tsx

"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 120px 20px 40px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 4.8rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 5px var(--color-primary);
`;

const Paragraph = styled(motion.p)`
  font-size: 1.8rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--color-text);
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </Title>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Hey there! I&apos;m <Highlight>Stefanie Jane</Highlight>, but you
          might know me as <Highlight>@hyperb1iss</Highlight> in the tech world.
          I&apos;m a full-stack developer and designer with a passion for
          creating innovative software solutions that make a difference.
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          I believe in the power of technology to transform lives, and I&apos;m
          always exploring new ways to push the boundaries of what&apos;s
          possible. Whether it&apos;s developing sleek user interfaces, crafting
          intuitive user experiences, or diving into the latest tech trends,
          I&apos;m all about blending technology with creativity.
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          When I&apos;m not coding or designing, you can find me sharing
          insights on my blog, contributing to open-source projects, or
          connecting with the tech community. I&apos;m an avid learner,
          constantly seeking new knowledge and skills to stay ahead in this
          ever-evolving field.
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Let&apos;s embark on a journey through technology and creativity
          together!
        </Paragraph>
      </MainContent>
    </PageContainer>
  );
};

export default About;
