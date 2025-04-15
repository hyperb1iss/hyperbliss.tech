"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import PageWrapper from "./PageWrapper";
import StyledLink from "./StyledLink";
import GlitchSpan from "./GlitchSpan";

// Custom styled components for the 404 page
const GlitchContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  padding: 2rem;
  z-index: 1;
`;

const GlitchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const GlitchTitle = styled(motion.h1)`
  font-size: 12rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
  text-shadow:
    0 0 10px var(--color-accent),
    0 0 20px var(--color-accent),
    3px 3px 0px var(--color-primary);

  @media (max-width: 768px) {
    font-size: 8rem;
  }

  @media (max-width: 480px) {
    font-size: 6rem;
  }
`;

const GlitchSubtitle = styled(motion.h2)`
  font-size: 3.6rem;
  margin-bottom: 3rem;
  color: var(--color-secondary);
  text-shadow:
    0 0 5px var(--color-secondary),
    0 0 10px var(--color-secondary);

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const GlitchText = styled(motion.p)`
  font-size: 1.8rem;
  max-width: 60rem;
  margin-bottom: 3rem;
  color: var(--color-text);

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const GlitchButton = styled(motion.button)`
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 1rem 2rem;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(162, 89, 255, 0.2);
    color: var(--color-accent);
    border-color: var(--color-accent);
    text-shadow: 0 0 5px var(--color-accent);
    box-shadow:
      0 0 10px rgba(0, 255, 240, 0.5),
      inset 0 0 10px rgba(0, 255, 240, 0.3);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.4), transparent);
    transition: all 0.6s ease;
  }

  &:hover:before {
    left: 100%;
  }
`;

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  // Set up the glitch effect canvas
  useEffect(() => {
    if (!canvasRef.current || isCanvasLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create a simplified version of CyberScape just for this 404 page
    let particles: { x: number; y: number; size: number; color: string; speed: number }[] = [];

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, window.innerWidth / 10);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          color: i % 3 === 0 ? "#a259ff" : i % 3 === 1 ? "#ff75d8" : "#00fff0",
          speed: Math.random() * 1 + 0.5,
        });
      }
    };

    initParticles();

    // Draw a grid effect
    const drawGrid = () => {
      if (!ctx) return;

      ctx.strokeStyle = "rgba(0, 255, 240, 0.1)";
      ctx.lineWidth = 1;

      // Horizontal lines
      const gridSize = 30;
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };

    // Random glitch effect that occasionally distorts the canvas
    const applyGlitchEffect = () => {
      if (!ctx || Math.random() > 0.05) return;

      // Save the current canvas state
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply random RGB shift
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.99) {
          // Red channel shift
          data[i] = data[i + 4] || data[i];
        }
        if (Math.random() > 0.99) {
          // Green channel shift
          data[i + 1] = data[i + 5] || data[i + 1];
        }
        if (Math.random() > 0.99) {
          // Blue channel shift
          data[i + 2] = data[i + 6] || data[i + 2];
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Occasionally add random blocks
      if (Math.random() > 0.7) {
        const blockCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < blockCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const width = Math.random() * 100 + 50;
          const height = Math.random() * 20 + 10;

          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
          ctx.fillRect(x, y, width, height);
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid();

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.y += particle.speed;

        // Reset particles that go off-screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
      });

      // Apply random glitch effects
      applyGlitchEffect();

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();
    setIsCanvasLoaded(true);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isCanvasLoaded]);

  return (
    <PageWrapper>
      <GlitchContainer>
        <GlitchCanvas ref={canvasRef} />

        <GlitchTitle
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlitchSpan>404</GlitchSpan>
        </GlitchTitle>

        <GlitchSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          SIGNAL LOST
        </GlitchSubtitle>

        <GlitchText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          The coordinates you&apos;ve entered don&apos;t exist in this realm. Perhaps the data was
          fragmented or reality has been altered.
        </GlitchText>

        <ButtonContainer>
          <StyledLink href="/">
            <GlitchButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Return to Nexus
            </GlitchButton>
          </StyledLink>

          <StyledLink href="/projects">
            <GlitchButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              Explore Projects
            </GlitchButton>
          </StyledLink>
        </ButtonContainer>
      </GlitchContainer>
    </PageWrapper>
  );
}
