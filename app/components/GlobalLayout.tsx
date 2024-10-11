// app/components/GlobalLayout.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { useHeaderContext } from "./HeaderContext";

const LayoutContainer = styled.div<{ $isHeaderExpanded: boolean }>`
  padding-top: ${(props) => (props.$isHeaderExpanded ? "200px" : "100px")};
  transition: padding-top 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-top: ${(props) => (props.$isHeaderExpanded ? "180px" : "80px")};
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { isExpanded } = useHeaderContext();

  return (
    <LayoutContainer $isHeaderExpanded={isExpanded}>
      <ContentWrapper>{children}</ContentWrapper>
    </LayoutContainer>
  );
};

export default GlobalLayout;
