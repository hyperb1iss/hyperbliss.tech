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
  gap: 2rem;
  flex-shrink: 0;

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
  font-size: 2.2rem;
  font-weight: 700;
  color: ${(props) => (props.$active ? "#00ffff" : "#ffffff")};
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  text-shadow: 0 0 1px #000, 0 0 2px #000,
    0 0 3px ${(props) => (props.$active ? "#00ffff" : "#ffffff")};

  &:hover,
  &:focus {
    color: #00ffff;
    text-shadow: 0 0 1px #000, 0 0 2px #000, 0 0 3px #00ffff, 0 0 5px #00ffff,
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

  @media (max-width: 1600px) {
    font-size: 2.4rem;
    padding: 0.5rem 0.9rem;
  }

  @media (max-width: 1400px) {
    font-size: 2.6rem;
    padding: 0.5rem 0.8rem;
  }

  @media (max-width: 1200px) {
    font-size: 2.4rem;
    padding: 0.5rem 0.7rem;
  }

  @media (max-width: 1000px) {
    font-size: 2.2rem;
    padding: 0.5rem 0.6rem;
  }

  @media (max-width: 900px) {
    font-size: 2rem;
    padding: 0.5rem 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 0.5rem 0;
    display: block;
    width: 100%;
    text-align: center;
    color: ${(props) => (props.$active ? "#00ffff" : "#ffffff")};

    &::after {
      bottom: 0;
    }
  }
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
      {NAV_ITEMS.map((item) => (
        <NavItem key={item}>
          <StyledNavLink
            href={`/${item.toLowerCase()}`}
            onClick={(e) => handleNavigation(`/${item.toLowerCase()}`, e)}
            $active={pathname === `/${item.toLowerCase()}`}
          >
            {item}
          </StyledNavLink>
        </NavItem>
      ))}
    </NavLinksContainer>
  );
};

export default NavLinks;
