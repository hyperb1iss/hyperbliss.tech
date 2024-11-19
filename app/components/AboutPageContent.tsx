// app/components/AboutPageContent.tsx

import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import PageLayout from "./PageLayout";
import PageTitle from "./PageTitle";
import SparklingName from "./SparklingName";

const ContentWrapper = styled(motion.div)`
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 2rem auto;
`;

const ProfileImage = styled(motion.img)`
  float: left;
  width: clamp(200px, 18vw, 300px);
  height: auto;
  border-radius: 50% / 40%;
  margin: 0 3rem 2rem 0;
  transition: all 0.3s ease-in-out;
  position: relative;
  filter: saturate(1.4) brightness(1.05);

  /* Neon Glow Effect */
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.6), 0 0 10px rgba(0, 255, 255, 0.5),
    0 0 20px rgba(0, 255, 255, 0.4);
  border: 2px solid rgba(0, 255, 255, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.5);
    border-color: rgba(255, 0, 255, 0.5);
  }

  @media (max-width: 768px) {
    float: none;
    margin: 0 auto 2rem auto;
    width: 80%;
    max-width: 300px;
    display: block;
  }
`;

const TextContent = styled(motion.div)`
  width: 100%;
  text-align: justify;

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
  }
`;

const Paragraph = styled.p`
  font-size: clamp(1.4rem, 1.8vw, 1.8rem);
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: 2.5rem;
  opacity: 0.9;
  transition: all 0.3s ease;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;

  &:hover {
    opacity: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  &:first-of-type {
    margin-top: 0;
    font-size: clamp(1.6rem, 2vw, 2rem);
    letter-spacing: 0.02em;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const StyledLink = styled.a`
  color: var(--color-accent);
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  padding: 0 0.2em;
  white-space: nowrap;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(162, 89, 255, 0.1);
    left: 0;
    top: 0;
    border-radius: 4px;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: var(--color-secondary);
    text-shadow: 0 0 15px rgba(255, 117, 216, 0.4);

    &::before {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
`;

const ContactSection = styled.div`
  margin-top: 4rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(162, 89, 255, 0.1);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(162, 89, 255, 0.03) 100%
  );
  border-radius: 0 0 20px 20px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ContactReason = styled.div`
  height: 100%;
  min-height: 220px;
  padding: 2.5rem;
  background: linear-gradient(
    135deg,
    rgba(162, 89, 255, 0.05) 0%,
    rgba(0, 255, 255, 0.05) 100%
  );
  border-radius: 2px;
  transition: all 0.4s ease-out;
  border: 1px solid rgba(0, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);

  /* Cyberpunk corner accent */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(
      45deg,
      transparent 50%,
      rgba(0, 255, 255, 0.1) 50%
    );
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }

  /* Glowing border effect */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(0, 255, 255, 0.1),
      rgba(162, 89, 255, 0.1)
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    padding: 1px;
    border-radius: 2px;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1), 0 0 40px rgba(0, 0, 0, 0.2),
      inset 0 0 20px rgba(0, 255, 255, 0.05);

    &::before {
      background: linear-gradient(
        135deg,
        transparent 40%,
        rgba(0, 255, 255, 0.2),
        rgba(162, 89, 255, 0.2)
      );
    }
  }

  h3 {
    color: var(--color-accent);
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    letter-spacing: 0.02em;
    padding-left: 15px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 4px;
      height: 70%;
      background: linear-gradient(
        to bottom,
        var(--color-accent),
        var(--color-secondary)
      );
      transform: translateY(-50%);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
  }

  &:hover h3 {
    transform: translateX(5px);
    color: var(--color-secondary);
  }

  p {
    font-size: 1.6rem;
    margin: 0;
    line-height: 1.6;
    opacity: 0.9;
    position: relative;
    z-index: 2;
    text-align: left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    min-height: auto;
    height: auto;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(
    135deg,
    var(--color-accent) 0%,
    var(--color-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-shadow: none;
  filter: brightness(1.2);
  padding: 0 0.2em;
`;

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
            <Paragraph>
              Hey there! I&apos;m <SparklingName name="Stefanie Jane" />, and
              I&apos;ve spent
              <GradientText> the last 25+ years </GradientText>
              turning complex technical challenges into beautiful products. My
              experience spans the entire technology stack—from embedded
              systems, hardware bringup, and OS development to cloud services,
              frontend, and AI.
            </Paragraph>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paragraph>
              I&apos;ve successfully led both open-source and enterprise
              projects, helping teams achieve technical excellence and
              innovation. I&apos;m proficient in multiple programming languages,
              and highly skilled with the use of modern AI developer tooling and
              practices. I thrive in hands-on leadership roles, and am committed
              to continuous learning and self improvement.
            </Paragraph>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paragraph>
              You might know me as the creator of{" "}
              <StyledLink
                href="https://en.wikipedia.org/wiki/CyanogenMod"
                target="_blank"
                rel="noopener noreferrer"
              >
                CyanogenMod
              </StyledLink>
              , now{" "}
              <StyledLink
                href="https://lineageos.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LineageOS
              </StyledLink>
              , which became the largest open-source Android distribution,
              empowering millions of people to take control of their devices. I
              also co-founded the company which was formed to support it&apos;s
              development.
            </Paragraph>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paragraph>
              When I&apos;m not hacking on code or flashing devices, you&apos;ll
              find me skating with my roller derby team, producing electronic
              music, or creating and contributing to open-source projects. Check
              out all my work on{" "}
              <StyledLink
                href="https://github.com/hyperb1iss"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </StyledLink>
              .
            </Paragraph>
          </motion.div>

          <motion.div
            variants={{
              ...itemVariants,
              visible: {
                ...itemVariants.visible,
                transition: {
                  duration: 0.7,
                  ease: "easeOut",
                },
              },
            }}
          >
            <ContactSection>
              <Paragraph style={{ marginBottom: "1rem", opacity: 0.95 }}>
                I&apos;m always excited to connect with fellow technologists,
                creators, and innovators. You can reach me via email or using
                any of the links below. Here&apos;s how we might work together:
              </Paragraph>

              <ContactGrid>
                {[
                  {
                    title: "Technical Consultation",
                    description:
                      "Need help building or customizing a device, getting a BSP in shape, building a mobile app, or integrating AI? Let's discuss your technical challenges.",
                  },
                  {
                    title: "Speaking Engagements",
                    description:
                      "Looking for a keynote speaker or technical presenter? I'd love to share insights at your next event.",
                  },
                  {
                    title: "Collaboration",
                    description:
                      "Have an interesting project or idea and need help building it? I'm always open to exploring new opportunities and partnerships.",
                  },
                  {
                    title: "Mentorship",
                    description:
                      "Seeking guidance in technology leadership or system design? Let's connect and grow together.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <ContactReason>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </ContactReason>
                  </motion.div>
                ))}
              </ContactGrid>
            </ContactSection>
          </motion.div>
        </TextContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default AboutPageContent;
