// app/components/Header.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
import { initializeCanvas } from "../lib/headerEffects";
import { NAV_ITEMS } from "../lib/navigation";

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
// const slideDown = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(-20px) scale(0.95);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0) scale(1);
//   }
// `;

// const slideUp = keyframes`
//   from {
//     opacity: 1;
//     transform: translateY(0) scale(1);
//   }
//   to {
//     opacity: 0;
//     transform: translateY(-20px) scale(0.95);
//   }
// `;

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
  padding: 0.5rem 1rem;
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
  position: relative;
  max-width: 60%;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
  overflow: hidden;
`;

// Modify the flicker keyframe animation
const flicker = keyframes`
  0%, 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%, 100% {
    opacity: 1;
    text-shadow: 
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff,
      0 0 6px #a259ff,
      0 0 7px #a259ff;
  }
  1%, 7%, 33%, 47%, 78%, 93% {
    opacity: 0.8;
    text-shadow: 
      0 0 1px #000,
      0 0 2px #000,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff;
  }
  2%, 8%, 34%, 48%, 79%, 94% {
    opacity: 0.9;
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #ff00ff,
      0 0 3px #a259ff,
      0 0 5px #a259ff,
      0 0 7px #a259ff;
  }
`;

// Add a new keyframe for chromatic aberration
const chromaticAberration = keyframes`
  0%, 95%, 100% {
    text-shadow: 
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 3px #a259ff,
      0 0 4px #a259ff,
      0 0 5px #a259ff;
  }
  50% {
    text-shadow: 
      -1px 0 1px #00fff0,
      1px 0 1px #ff00ff,
      0 0 3px #a259ff,
      0 0 5px #a259ff;
  }
`;

// Add this new keyframe for the color-shifting glow effect
const shiftingGlow = keyframes`
  0%, 100% {
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #ff00ff,
      0 0 3px #00fff0,
      0 0 5px #00fff0,
      0 0 7px #00fff0;
  }
  25% {
    text-shadow: 
      1px 0 1px #ff00ff,
      -1px 0 1px #00fff0,
      0 0 3px #ff00ff,
      0 0 5px #ff00ff,
      0 0 7px #ff00ff;
  }
  50% {
    text-shadow: 
      1px 0 1px #a259ff,
      -1px 0 1px #00fff0,
      0 0 3px #a259ff,
      0 0 5px #a259ff,
      0 0 7px #a259ff;
  }
  75% {
    text-shadow: 
      1px 0 1px #00fff0,
      -1px 0 1px #a259ff,
      0 0 3px #00fff0,
      0 0 5px #00fff0,
      0 0 7px #00fff0;
  }
`;

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 2.6rem;
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${animateGradient} 10s ease infinite,
    ${flicker} 8s step-end infinite,
    ${chromaticAberration} 3s ease-in-out infinite;
  transition: text-shadow 0.1s ease;

  &:hover {
    animation: ${animateGradient} 10s ease infinite,
      ${shiftingGlow} 4s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

// Add these new keyframes if you want different effects for emojis
const emojiFlicker = keyframes`
  // ... (customize this for emojis)
`;

const emojiChromaticAberration = keyframes`
  // ... (customize this for emojis)
`;

const emojiShiftingGlow = keyframes`
  // ... (customize this for emojis)
`;

const LogoEmojis = styled.span`
  font-size: 2.4rem;
  margin: 0 0.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

// Update these keyframes for emoji animations
const rotateOnce = keyframes`
  0%, 70% { transform: rotate(0deg); }
  80%, 100% { transform: rotate(var(--rotation-angle)); }
`;

// Update the GlowingEmoji styled component
const GlowingEmoji = styled(LogoEmojis)<{
  $animationDelay: number;
  $clockwise: boolean;
}>`
  --rotation-angle: ${(props) => (props.$clockwise ? "90deg" : "-90deg")};
  animation: ${rotateOnce} 20s ease-in-out infinite;
  animation-delay: ${(props) => props.$animationDelay}s;
  transition: text-shadow 0.3s ease;
  text-shadow: 0 0 1px #fff, 0 0 2px #a259ff;
  display: inline-block;

  &:hover {
    text-shadow: 0 0 1px #fff, 0 0 2px #00fff0, 0 0 3px #00fff0;
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
  font-weight: 700; // Increased from 500 to 700 for better visibility
  color: ${(props) =>
    props.$active
      ? "#00ffff"
      : "#ffffff"}; // Changed from #f0f0f0 to #ffffff for inactive links
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

// Add a new keyframe for the menu icon animation
// const rotateMenu = keyframes`
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(180deg);
//   }
// `;

// Update the MobileMenuIcon styled component
const MobileMenuIcon = styled(motion.div)`
  display: none;
  width: 24px; // Reduced from 30px
  height: 24px; // Reduced from 30px
  cursor: pointer;
  z-index: 1100;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`;

const MenuLine = styled(motion.span)`
  width: 100%;
  height: 2px; // Reduced from 3px for a slightly thinner line
  background-color: var(--color-accent);
  border-radius: 4px; // Slightly reduced from 5px
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

/**
 * Header component
 * Renders the main navigation header with animated effects.
 * @returns {JSX.Element} Rendered header
 */
const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const animateAndNavigate = useAnimatedNavigation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null); // Ref for the nav element
  const mobileMenuRef = useRef<HTMLUListElement>(null);

  // Effect for initializing canvas
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

  // Handler for navigation
  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    animateAndNavigate(href);
  };

  // Handler for clicking outside mobile menu
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".mobile-menu-icon")
      ) {
        setMenuOpen(false);
      }
    },
    [menuOpen]
  );

  // Effect for adding/removing click outside listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Animation variants for menu icon
  const topLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 10 },
  };

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -10 },
  };

  // Update this function to generate random values for emoji props
  const getRandomEmojiProps = () => ({
    $animationDelay: Math.random() * -20, // Random negative delay up to 20 seconds
    $clockwise: Math.random() < 0.5,
  });

  return (
    <Nav ref={navRef}>
      <Canvas ref={canvasRef} />
      <NavContent>
        {/* Logo */}
        <Logo href="/" onClick={() => handleNavigation("/")} ref={logoRef}>
          <LogoEmojis>🌠</LogoEmojis>
          <LogoText>𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼</LogoText>
          <LogoEmojis>✨</LogoEmojis>
          <GlowingEmoji {...getRandomEmojiProps()}>⎊</GlowingEmoji>
          <GlowingEmoji {...getRandomEmojiProps()}>⨳</GlowingEmoji>
          <GlowingEmoji {...getRandomEmojiProps()}>✵</GlowingEmoji>
          <GlowingEmoji {...getRandomEmojiProps()}>⊹</GlowingEmoji>
        </Logo>
        {/* Desktop Navigation */}
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
        {/* Mobile Menu Icon */}
        <MobileMenuIcon
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-icon"
        >
          <MenuLine
            variants={topLineVariants}
            animate={menuOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <MenuLine
            variants={middleLineVariants}
            animate={menuOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <MenuLine
            variants={bottomLineVariants}
            animate={menuOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
        </MobileMenuIcon>
      </NavContent>
      {/* Mobile Navigation */}
      <MobileNavLinks open={menuOpen} ref={mobileMenuRef}>
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
