"use client";

import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled from "styled-components";

const MainContentWrapper = styled(motion.main)`
  flex: 1;
  padding-top: 10px;
`;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

interface MainContentProps {
  children: ReactNode;
}

/**
 * MainContent component
 * Wraps the main content of each page with animation effects.
 * @param {MainContentProps} props - The component props
 * @returns {JSX.Element} Animated main content wrapper
 */
const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <MainContentWrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </MainContentWrapper>
  );
};

export default MainContent;
