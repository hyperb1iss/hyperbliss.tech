// app/components/MainContentWrapper.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useHeaderContext } from "./Header";

const StyledWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({
  children,
}) => {
  const { isExpanded } = useHeaderContext();

  return (
    <StyledWrapper
      initial={false}
      animate={{ paddingTop: isExpanded ? "160px" : "80px" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </StyledWrapper>
  );
};

export default MainContentWrapper;
