// app/components/StyledLink.tsx
import Link from "next/link";
import React from "react";
import styled from "styled-components";

/**
 * StyledAnchor component
 * A simple styled anchor without extra padding or background.
 */
const StyledAnchor = styled.a`
  text-decoration: none;
  color: inherit;
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
 * Wraps the Next.js Link component with minimal styling.
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
