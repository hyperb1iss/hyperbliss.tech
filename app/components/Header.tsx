// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import styled from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
import { NAV_ITEMS } from "../lib/navigation";
import { initializeCanvas } from "../lib/headerEffects"; // Import the effect

const Nav = styled.nav`
  position: relative;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  overflow: hidden;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 2.4rem;
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: 10s ease infinite;
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
  z-index: -1;
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const animateAndNavigate = useAnimatedNavigation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cleanupCanvas = initializeCanvas(canvasRef.current); // Initialize effects
    return () => {
      cleanupCanvas(); // Clean up on unmount
    };
  }, []);

  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    animateAndNavigate(href);
  };

  return (
    <Nav>
      <Canvas ref={canvasRef} />
      <NavContent>
        <Logo as="a" onClick={() => handleNavigation("/")}>
          <LogoEmojis>🌠</LogoEmojis>
          <LogoText>𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼</LogoText>
          <LogoEmojis>✨ ⎊ ⨳ ✵ ⊹</LogoEmojis>
        </Logo>
        <NavLinks>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <StyledNavLink
                onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
                $active={pathname === `/${item.toLowerCase()}`}
              >
                {item}
              </StyledNavLink>
            </li>
          ))}
        </NavLinks>
        <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </MobileMenuIcon>
      </NavContent>
      <MobileNavLinks open={menuOpen}>
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <StyledNavLink
              onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
              $active={pathname === `/${item.toLowerCase()}`}
            >
              {item}
            </StyledNavLink>
          </li>
        ))}
      </MobileNavLinks>
    </Nav>
  );
};

export default Header;
