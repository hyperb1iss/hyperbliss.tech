// app/components/Header.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { useAnimatedNavigation } from "../hooks/useAnimatedNavigation";
import { NAV_ITEMS } from "../lib/navigation";

const Nav = styled.nav`
  position: relative; /* Changed to position relative to contain the canvas */
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  overflow: hidden; /* Ensure the canvas doesn't overflow */
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`;

const LogoText = styled.span`
  font-family: var(--font-logo);
  font-size: 2.6rem;
  background: linear-gradient(270deg, #a259ff, #ff75d8, #00fff0, #a259ff);
  background-size: 800% 800%;
  -webkit-background-clip: text;
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

  li {
    padding: 1rem;
    text-align: right;
  }
`;

// Canvas styles
const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Ensure the canvas doesn't block clicks */
  z-index: -1; /* Place the canvas behind the nav content */
`;

const Header: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const animateAndNavigate = useAnimatedNavigation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animationFrameId: number;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle window resize
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "#00fff0";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const particlesArray: Particle[] = [];
    const numberOfParticles = (width * height) / 8000;

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = dx * dx + dy * dy;
          if (distance < 4000) {
            ctx.strokeStyle = "rgba(0, 255, 240, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
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
