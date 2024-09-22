// app/about/page.tsx

'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
      <Header />
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
          Hey there! I'm <Highlight>Stefanie Kondik</Highlight>, but you might
          know me as <Highlight>Hyperbliss</Highlight> in the tech world. With a
          passion for creating innovative software solutions and a keen eye for
          design, I love blending technology with creativity.
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          From developing sleek user interfaces to exploring the latest in tech
          trends, I'm all about pushing the boundaries of what's possible. When
          I'm not coding or designing, you can find me sharing insights on my
          blog, tinkering with new projects, or connecting with like-minded
          enthusiasts.
        </Paragraph>
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Let's embark on a journey through technology and creativity together!
        </Paragraph>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default About;
