'use client';

import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

/**
 * AboutSection styles the about page content.
 */
const AboutSection = styled.section`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: #a239ca;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
`;

/**
 * About component provides information about the site owner.
 */
const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>Hyperbliss | About</title>
        <meta
          name="description"
          content="Learn more about Stefanie Kondik, a developer, designer, and tech enthusiast."
        />
      </Head>
      <Header />
      <AboutSection>
        <h1>About Me</h1>
        <p>
          Hey there! I'm <strong>Stefanie Kondik</strong>, but you might know me
          as <strong>Hyperbliss</strong> in the tech world. With a passion for
          creating innovative software solutions and a keen eye for design, I
          love blending technology with creativity.
        </p>
        <p>
          From developing sleek user interfaces to exploring the latest in tech
          trends, I'm all about pushing the boundaries of what's possible. When
          I'm not coding or designing, you can find me sharing insights on my
          blog, tinkering with new projects, or connecting with like-minded
          enthusiasts.
        </p>
        <p>Let's embark on a journey through technology and creativity together!</p>
      </AboutSection>
      <Footer />
    </>
  );
};

export default About;
