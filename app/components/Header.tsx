// app/components/Header.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { keyframes, styled } from "styled-components";
import {
  initializeCyberScape,
  triggerCyberScapeAnimation,
} from "../cyberscape/CyberScape";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
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

interface HeaderContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <HeaderContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Nav component now accepts an $isExpanded prop to control its height
const Nav = styled.nav<{ $isExpanded: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 1rem;
  height: ${(props) => (props.$isExpanded ? "200px" : "100px")};
  transition: height 0.3s ease;
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
  height: 100%;
  overflow: hidden; // Add this to clip the logo when necessary
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  max-width: 60%;
  white-space: nowrap;
  height: 100%;
  overflow: hidden; // Change back to hidden

  @media (max-width: 768px) {
    max-width: calc(100% - 80px); // Adjust this value as needed
    overflow: hidden;
  }
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
  font-size: 3rem;
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
    font-size: 2.6rem;
  }
`;

// Add these new keyframes for the sparkle and shimmer effect
const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.95); }
`;

const shimmer = keyframes`
  0% { text-shadow: -1px -1px 2px rgba(255,255,255,0.3), 1px 1px 2px rgba(255,255,255,0.3); }
  25% { text-shadow: 1px -1px 2px rgba(255,255,255,0.3), -1px 1px 2px rgba(255,255,255,0.3); }
  50% { text-shadow: 1px 1px 2px rgba(255,255,255,0.3), -1px -1px 2px rgba(255,255,255,0.3); }
  75% { text-shadow: -1px 1px 2px rgba(255,255,255,0.3), 1px -1px 2px rgba(255,255,255,0.3); }
  100% { text-shadow: -1px -1px 2px rgba(255,255,255,0.3), 1px 1px 2px rgba(255,255,255,0.3); }
`;

// Update the LogoEmojis styled component
const LogoEmojis = styled.span`
  font-size: 2.4rem;
  margin: 0 0.5rem;
  flex-shrink: 0;
  animation: ${sparkle} 3s ease-in-out infinite, ${shimmer} 5s linear infinite;
  display: inline-block;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation: ${shimmer} 2s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    position: relative;
    z-index: 1;
    padding-top: 5px;
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
  animation: ${rotateOnce} 20s ease-in-out infinite,
    ${sparkle} 3s ease-in-out infinite, ${shimmer} 5s linear infinite;
  animation-delay: ${(props) => props.$animationDelay}s, 0s, 0s;
  transition: text-shadow 0.3s ease;
  text-shadow: 0 0 1px #fff, 0 0 2px #a259ff;
  display: inline-block;
  transform-origin: center;

  &:hover {
    text-shadow: 0 0 1px #fff, 0 0 2px #00fff0, 0 0 3px #00fff0;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
  flex-shrink: 0; // Prevent nav links from shrinking

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

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

// Update the MobileMenuIcon styled component
const MobileMenuIcon = styled(motion.div)`
  display: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 1rem;
  z-index: 1100;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.7)); // Add glow effect

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`;

const MenuLine = styled(motion.span)`
  width: 100%;
  height: 3px;
  background-color: var(--color-accent);
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.7); // Add glow effect
`;

// Update the MobileNavLinks styled component
const MobileNavLinks = styled.ul<{ open: boolean }>`
  list-style: none;
  position: fixed;
  top: 100px;
  right: 0;
  background-color: rgba(10, 10, 20, 0.95);
  width: 250px;
  flex-direction: column;
  display: flex;
  z-index: 1001;
  padding: 1rem 1rem;
  border-radius: 10px 0 0 10px; // Rounded corners only on the left side
  box-shadow: -5px 0 20px rgba(162, 89, 255, 0.5); // Increased glow and moved to the left side
  border-left: 1px solid rgba(162, 89, 255, 0.4); // Added left border
  opacity: ${(props) => (props.open ? 1 : 0)};
  transform: ${(props) => (props.open ? "translateX(0)" : "translateX(100%)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${(props) => (props.open ? "all" : "none")};

  li {
    padding: 1rem;
    text-align: center;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
      background-color: rgba(162, 89, 255, 0.2);
      transform: scale(1.05);
    }
  }
`;

// Update the MobileNavItem styled component
const MobileNavItem = styled(motion.li)<{ index: number; open: boolean }>`
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
  z-index: -1;
`;

const ChevronIcon = styled(motion.div)`
  position: absolute;
  bottom: 5px;
  left: 20px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: var(--color-accent);
  opacity: 0.4;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * Header component
 * Renders the main navigation header with animated effects and expandable CyberScape area.
 * @returns {JSX.Element} Rendered header
 */
const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const animateAndNavigate = useAnimatedNavigation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLUListElement>(null);
  const { isExpanded, setIsExpanded } = useHeaderContext();

  const chevronVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  };

  // Move resizeCanvas function outside of useEffect
  const resizeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
  };

  // Effect for initializing canvas
  useEffect(() => {
    let cleanupCanvas: () => void = () => {};
    if (canvasRef.current && logoRef.current && navRef.current) {
      resizeCanvas(); // Initial resize
      window.addEventListener("resize", resizeCanvas);

      cleanupCanvas = initializeCyberScape(
        canvasRef.current,
        logoRef.current,
        navRef.current
      );
    }
    return () => {
      if (cleanupCanvas) cleanupCanvas();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Handler for navigation
  const handleNavigation = (href: string, event: React.MouseEvent) => {
    setMenuOpen(false);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      triggerCyberScapeAnimation(x, y);
    }
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
    $animationDelay: Math.random() * -20,
    $clockwise: Math.random() < 0.5,
  });

  // Add this new function to trigger CyberScape animation when menu is opened
  const triggerMenuAnimation = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = rect.right - 20; // 20px from the right edge
      const y = rect.top + 50; // Middle of the header height
      triggerCyberScapeAnimation(x, y);
    }
  }, []);

  // Update the menu open/close handler
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    triggerMenuAnimation();
  }, [triggerMenuAnimation]);

  return (
    <Nav ref={navRef} $isExpanded={isExpanded}>
      <Canvas ref={canvasRef} />
      <NavContent>
        {/* Logo */}
        <Logo
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/", e);
          }}
          ref={logoRef}
        >
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
                onClick={(e) => handleNavigation(`/${item.toLowerCase()}`, e)}
                $active={pathname === `/${item.toLowerCase()}`}
              >
                {item}
              </StyledNavLink>
            </NavItem>
          ))}
        </NavLinks>
        {/* Mobile Menu Icon */}
        <MobileMenuIcon
          onClick={toggleMenu}
          className="mobile-menu-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
          <MobileNavItem
            key={item}
            index={index}
            open={menuOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StyledNavLink
              onClick={(e) => handleNavigation(`/${item.toLowerCase()}`, e)}
              $active={pathname === `/${item.toLowerCase()}`}
            >
              {item}
            </StyledNavLink>
          </MobileNavItem>
        ))}
      </MobileNavLinks>
      <ChevronIcon
        onClick={() => setIsExpanded(!isExpanded)}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={chevronVariants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </ChevronIcon>
    </Nav>
  );
};

export default Header;
