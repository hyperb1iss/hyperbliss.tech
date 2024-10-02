// app/components/StyledLink.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

/**
 * StyledAnchor component
 * Enhances the link with a cyberpunk-themed glow effect and subtle scaling on hover.
 * Added blur effect and reduced glow intensity for a more refined appearance.
 */
const StyledAnchor = styled(motion.a)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(10, 10, 20, 0.8)
  );
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.1); bbbbb
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2); /* Reduced glow on hover */
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

/**
 * StyledLinkProps interface
 * Extends the default anchor props with a required href and children.
 */
type StyledLinkProps = React.ComponentPropsWithoutRef<typeof StyledAnchor> & {
  href: string;
  children: React.ReactNode;
};

/**
 * StyledLink component
 * Wraps the Next.js Link component with enhanced styling and animations.
 * @param {StyledLinkProps} props - The component props
 * @returns {JSX.Element} Rendered styled link
 */
const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <Link href={href} legacyBehavior passHref>
        <StyledAnchor ref={ref} {...props}>
          {children}
        </StyledAnchor>
      </Link>
    );
  }
);

StyledLink.displayName = "StyledLink";

export default StyledLink;
