// app/components/GlobalLayout.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { useHeaderContext } from "./HeaderContext";
import Footer from "./Footer";

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

/**
 * GlobalLayout component
 * Wraps the application content with global styles and header state.
 * Adjusts the padding based on the header expansion state.
 * Includes the Footer at the bottom of the page.
 * @param {GlobalLayoutProps} props - The component props
 * @returns {JSX.Element} Rendered global layout
 */
const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { isExpanded } = useHeaderContext();

  return (
    <LayoutContainer $isHeaderExpanded={isExpanded}>
      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
    </LayoutContainer>
  );
};

export default GlobalLayout;
