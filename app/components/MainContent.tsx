"use client";

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

interface MainContentProps {
  children: ReactNode;
}

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