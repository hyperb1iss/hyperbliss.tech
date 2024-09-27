// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
import { NAV_ITEMS } from "../lib/navigation";
import { initializeCanvas } from "../lib/headerEffects";

// Define the keyframes for the gradient animation
const animateGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled Components

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 2rem;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  position: relative; /* For accurate bounding rect calculations */
`;

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 2.4rem;
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  background-clip: text;
  color: transparent;
  animation: ${animateGradient} 10s ease infinite;
  text-shadow: 0 0 5px var(--color-primary);
  transition: text-shadow 0.3s ease;

  &:hover {
    text-shadow: 0 0 10px var(--color-accent);
  }
`;

const LogoEmojis = styled.span`
  font-size: 2.4rem;
  margin: 0 0.5rem;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const StyledNavLink = styled.a<{ $active: boolean }>`
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 500;
  color: ${(props) => (props.$active ? "#00ffff" : "#f0f0f0")};
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00ffff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 2.4rem;
  color: var(--color-text);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.ul<{ open: boolean }>`
  list-style: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(0, 0, 0, 0.95);
  width: 200px;
  flex-direction: column;
  display: ${(props) => (props.open ? "flex" : "none")};
  z-index: 999; /* Ensure the menu appears above other elements */

  li {
    padding: 1rem;
    text-align: right;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1; /* Place the canvas behind the nav content */
`;

// Header Component

const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const animateAndNavigate = useAnimatedNavigation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null); // Ref for the nav element

  useEffect(() => {
    let cleanupCanvas: () => void = () => {};
    if (canvasRef.current && logoRef.current && navRef.current) {
      cleanupCanvas = initializeCanvas(
        canvasRef.current,
        logoRef.current,
        navRef.current
      );
    }
    return () => {
      if (cleanupCanvas) cleanupCanvas();
    };
  }, []);

  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    animateAndNavigate(href);
  };

  return (
    <Nav ref={navRef}>
      <Canvas ref={canvasRef} />
      <NavContent>
        <Logo href="/" onClick={() => handleNavigation("/")} ref={logoRef}>
          <LogoEmojis>🌠</LogoEmojis>
          <LogoText>𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼</LogoText>
          <LogoEmojis>✨ ⎊ ⨳ ✵ ⊹</LogoEmojis>
        </Logo>
        <NavLinks>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item}>
              <StyledNavLink
                onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
                $active={pathname === `/${item.toLowerCase()}`}
              >
                {item}
              </StyledNavLink>
            </NavItem>
          ))}
        </NavLinks>
        <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </MobileMenuIcon>
      </NavContent>
      <MobileNavLinks open={menuOpen}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item}>
            <StyledNavLink
              onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
              $active={pathname === `/${item.toLowerCase()}`}
            >
              {item}
            </StyledNavLink>
          </NavItem>
        ))}
      </MobileNavLinks>
    </Nav>
  );
};

export default Header;
