// app/components/Header.tsx
"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import {
  initializeCyberScape,
  triggerCyberScapeAnimation,
} from "../cyberscape/CyberScape";
import { useHeaderContext } from "./HeaderContext";
import Logo from "./Logo";
import MobileMenuIcon from "./MobileMenuIcon";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";

/**
 * Styled components for the header
 */
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
  overflow: hidden;
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

const chevronVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 },
};

/**
 * Header component
 * Renders the main navigation header with animated effects and expandable CyberScape area.
 * @returns {JSX.Element} Rendered header
 */
const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { isExpanded, setIsExpanded } = useHeaderContext();

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

  // Effect for initializing canvas and triggering CyberScape
  useEffect(() => {
    let cleanupCanvas: () => void = () => {};
    if (canvasRef.current && navRef.current) {
      resizeCanvas(); // Initial resize
      window.addEventListener("resize", resizeCanvas);

      cleanupCanvas = initializeCyberScape(
        canvasRef.current,
        navRef.current as unknown as HTMLAnchorElement,
        navRef.current as unknown as HTMLAnchorElement
      );
    }

    // Cleanup on unmount
    return () => {
      if (cleanupCanvas) cleanupCanvas();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Handler for triggering CyberScape animation on header interaction (click)
  const handleHeaderClick = useCallback((event: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      triggerCyberScapeAnimation(x, y); // Trigger the CyberScape animation
    }
  }, []);

  // Attach the click event listener to the header for CyberScape
  useEffect(() => {
    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener("click", handleHeaderClick);
    }
    return () => {
      if (navElement) {
        navElement.removeEventListener("click", handleHeaderClick);
      }
    };
  }, [handleHeaderClick]);

  // Handler for toggling menu
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    triggerMenuAnimation();
  }, []);

  // Function to trigger CyberScape animation when menu is opened
  const triggerMenuAnimation = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = rect.right - 20; // 20px from the right edge
      const y = rect.top + 50; // Middle of the header height
      triggerCyberScapeAnimation(x, y);
    }
  }, []);

  // Handler for toggling header expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Nav ref={navRef} $isExpanded={isExpanded}>
      <Canvas ref={canvasRef} />
      <NavContent>
        {/* Logo */}
        <Logo />
        {/* Desktop Navigation */}
        <NavLinks />
        {/* Mobile Menu Icon */}
        <MobileMenuIcon menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </NavContent>
      {/* Mobile Navigation */}
      <MobileNavLinks open={menuOpen} setMenuOpen={setMenuOpen} />
      <ChevronIcon
        onClick={toggleExpansion}
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
