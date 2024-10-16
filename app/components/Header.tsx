// app/components/Header.tsx
"use client";

import { motion } from "framer-motion";
import { debounce } from "lodash";
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
  padding: 1rem 2rem; // Increased horizontal padding
  height: ${(props) => (props.$isExpanded ? "200px" : "100px")};
  transition: height 0.3s ease;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; // Ensures the canvas scales to the full width
  height: 100%; // Ensures the canvas scales to the full height
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

  // Effect for initializing canvas and triggering CyberScape
  useEffect(() => {
    let cleanupCanvas: () => void = () => {};
    if (canvasRef.current && navRef.current) {
      cleanupCanvas = initializeCyberScape(
        canvasRef.current,
        navRef.current as unknown as HTMLAnchorElement,
        navRef.current as HTMLElement
      );
    }

    // Cleanup on unmount
    return () => {
      if (cleanupCanvas) cleanupCanvas();
    };
  }, []);

  // Optimized handler for triggering CyberScape animation
  const handleHeaderInteraction = useCallback(() => {
    const debouncedTrigger = debounce((event: MouseEvent | TouchEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        let x, y;
        if (event instanceof MouseEvent) {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
        } else if (event instanceof TouchEvent) {
          x = event.touches[0].clientX - rect.left;
          y = event.touches[0].clientY - rect.top;
        }
        if (x !== undefined && y !== undefined) {
          triggerCyberScapeAnimation(x, y);
        }
      }
    }, 100);

    const interactionHandler = (event: MouseEvent | TouchEvent) => {
      debouncedTrigger(event);
    };

    // Attach the cancel method to the interactionHandler
    interactionHandler.cancel = debouncedTrigger.cancel;

    return interactionHandler;
  }, [canvasRef]);

  // Attach the interaction event listeners to the header for CyberScape
  useEffect(() => {
    const navElement = navRef.current;
    const interactionHandler = handleHeaderInteraction();
    if (navElement) {
      navElement.addEventListener("click", interactionHandler);
      navElement.addEventListener("touchstart", interactionHandler, {
        passive: true,
      });
    }
    return () => {
      if (navElement) {
        navElement.removeEventListener("click", interactionHandler);
        navElement.removeEventListener("touchstart", interactionHandler);
      }
      interactionHandler.cancel();
    };
  }, [handleHeaderInteraction]);

  // Function to trigger CyberScape animation when menu is opened
  const triggerMenuAnimation = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = rect.right - 20; // 20px from the right edge
      const y = rect.top + 50; // Middle of the header height
      triggerCyberScapeAnimation(x, y);
    }
  }, []);

  // Handler for toggling menu
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    triggerMenuAnimation();
  }, [triggerMenuAnimation]);

  // Handler for toggling header expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Nav ref={navRef} $isExpanded={isExpanded}>
      <Canvas ref={canvasRef} />
      <NavContent>
        <Logo />
        <NavLinks />
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
