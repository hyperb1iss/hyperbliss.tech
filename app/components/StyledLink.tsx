// app/components/StyledLink.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

// Define the styled motion.a component with desired styles
const StyledAnchor = styled(motion.a)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(10, 10, 20, 0.8)
  );
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 255, 0.2),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

// Define the props for StyledLink by extending motion.a's props
type StyledLinkProps = React.ComponentPropsWithoutRef<typeof StyledAnchor> & {
  href: string;
  children: React.ReactNode;
};

// Create a forwarding component to pass refs correctly
const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <Link href={href} legacyBehavior>
        <StyledAnchor ref={ref} {...props}>
          {children}
        </StyledAnchor>
      </Link>
    );
  }
);

StyledLink.displayName = "StyledLink";

export default StyledLink;
