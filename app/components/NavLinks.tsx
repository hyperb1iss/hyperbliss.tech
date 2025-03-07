// app/components/NavLinks.tsx
"use client";

import { usePathname } from "next/navigation";
import { styled } from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
import { NAV_ITEMS } from "../lib/navigation";

/**
 * Styled component for navigation links container.
 */
const NavLinksContainer = styled.ul`
  list-style: none;
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: auto;
  align-items: center;

  @media (min-width: 769px) {
    gap: calc(0.5rem + 0.5vw); // Scale up gap for larger screens
  }

  @media (min-width: 1200px) {
    gap: calc(0.5rem + 1vw); // Further increase gap for very large screens
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/**
 * Styled component for navigation item.
 */
const NavItem = styled.li`
  position: relative;
`;

/**
 * Styled component for navigation link.
 */
const StyledNavLink = styled.a<{ $active: boolean }>`
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => (props.$active ? "#00ffff" : "#ffffff")};
  padding: 0.5rem 0.5rem; // Decreased initial padding
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  text-shadow:
    0 0 1px #000,
    0 0 2px #000,
    0 0 3px ${(props) => (props.$active ? "#00ffff" : "#ffffff")};

  &:hover,
  &:focus {
    color: #00ffff;
    text-shadow:
      0 0 1px #000,
      0 0 2px #000,
      0 0 3px #00ffff,
      0 0 5px #00ffff,
      0 0 7px #00ffff;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00ffff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    box-shadow: 0 0 5px #00ffff;
  }

  &:hover::after,
  &:focus::after {
    transform: scaleX(1);
  }

  @media (min-width: 769px) {
    font-size: calc(1.8rem + 0.3vw);
    padding: 0.5rem calc(0.5rem + 0.2vw); // Scale up padding for larger screens
  }

  @media (min-width: 1200px) {
    font-size: calc(2rem + 0.3vw);
    padding: 0.5rem calc(0.5rem + 0.4vw); // Further increase padding for very large screens
  }

  ${(props) =>
    props.$active &&
    `
    &.active {
      color: #00ffff;
    }
  `}
`;

/**
 * NavLinks component
 * Renders the desktop navigation links.
 * @returns {JSX.Element} Rendered navigation links
 */
const NavLinks: React.FC = () => {
  const pathname = usePathname();
  const animateAndNavigate = useAnimatedNavigation();

  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    animateAndNavigate(href);
  };

  return (
    <NavLinksContainer>
      {NAV_ITEMS.map((item) => {
        const href = `/${item.toLowerCase()}`;
        const isActive = pathname === href;
        return (
          <NavItem key={item}>
            <StyledNavLink
              href={href}
              onClick={(e) => handleNavigation(href, e)}
              $active={isActive}
              className={isActive ? "active" : ""}
            >
              {item}
            </StyledNavLink>
          </NavItem>
        );
      })}
    </NavLinksContainer>
  );
};

export default NavLinks;
