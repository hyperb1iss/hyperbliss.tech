// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

// Define keyframes for mobile menu slide-in
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
`;

// Define the slideIn animation
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

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
  -webkit-background-clip: text;
  color: transparent;
  animation: ${animateGradient} 10s ease infinite;
  text-shadow: 0 0 10px var(--color-primary);
  transition: text-shadow 0.3s ease;

  &:hover {
    text-shadow: 0 0 15px var(--color-accent);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LogoEmojis = styled.span`
  font-size: 2.4rem;
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
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
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
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

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 0.5rem 0;
    display: block;
    width: 100%;
    text-align: center;
    color: ${(props) => (props.$active ? "#00ffff" : "#f0f0f0")};

    &::after {
      bottom: 0;
    }
  }
`;

// Add a new keyframe for the menu icon animation
const rotateMenu = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

// Update the MobileMenuIcon styled component
const MobileMenuIcon = styled.div<{ open: boolean }>`
  display: none;
  font-size: 2.4rem;
  color: var(--color-accent);
  cursor: pointer;
  z-index: 1100;
  transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease;
  transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    color: var(--color-secondary);
    text-shadow: 0 0 10px var(--color-secondary), 0 0 20px var(--color-secondary);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

// Update the MobileNavLinks styled component
const MobileNavLinks = styled.ul<{ open: boolean }>`
  list-style: none;
  position: fixed;
  top: 80px; // Adjust based on your header height
  right: 20px; // Position from the right side
  background-color: rgba(10, 10, 20, 0.95); // Darker background
  width: 200px; // Fixed width
  flex-direction: column;
  display: flex;
  z-index: 1001;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(162, 89, 255, 0.3); // Glowing effect
  border: 1px solid rgba(162, 89, 255, 0.2); // Subtle border
  opacity: ${(props) => (props.open ? 1 : 0)};
  transform: ${(props) =>
    props.open ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)"};
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${(props) => (props.open ? "all" : "none")};

  li {
    padding: 1rem;
    text-align: center;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(162, 89, 255, 0.2);
    }
  }
`;

// Update the MobileNavItem styled component
const MobileNavItem = styled(NavItem)<{ index: number; open: boolean }>`
  @media (max-width: 768px) {
    opacity: 0;
    transform: translateX(20px);
    animation: ${slideIn} 0.3s forwards;
    animation-delay: ${(props) => (props.open ? props.index * 0.1 : 0)}s;
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
        <MobileMenuIcon open={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </MobileMenuIcon>
      </NavContent>
      <MobileNavLinks open={menuOpen}>
        {NAV_ITEMS.map((item, index) => (
          <MobileNavItem key={item} index={index} open={menuOpen}>
            <StyledNavLink
              onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
              $active={pathname === `/${item.toLowerCase()}`}
            >
              {item}
            </StyledNavLink>
          </MobileNavItem>
        ))}
      </MobileNavLinks>
    </Nav>
  );
};

export default Header;
