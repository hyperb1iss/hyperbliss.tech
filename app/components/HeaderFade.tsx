// app/components/HeaderFade.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { useHeaderContext } from "./HeaderContext";

const FadeContainer = styled.div<{ $isExpanded: boolean }>`
  height: 40px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  position: fixed;
  top: ${(props) => (props.$isExpanded ? "200px" : "100px")};
  left: 0;
  right: 0;
  z-index: 999;
`;

const HeaderFade: React.FC = () => {
  const { isExpanded } = useHeaderContext();

  return <FadeContainer $isExpanded={isExpanded} />;
};

export default HeaderFade;
