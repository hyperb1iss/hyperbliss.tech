"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import PageWrapper from "./PageWrapper";
import StyledLink from "./StyledLink";
import GlitchSpan from "./GlitchSpan";

// Custom styled components for the 404 page
const GlitchContainer = styled.div`
  position: fixed; /* Use fixed positioning to take over viewport */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  z-index: 0; /* Below header but above background */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  margin-top: -2rem; /* Move content up slightly */
  width: 100%;
  max-width: 100%;
  min-height: 500px; /* Ensure minimum height for content */
`;

const GlitchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

// Dramatic but lightweight keyframes
const slowScaleRotate = `
  @keyframes slowScaleRotate {
    0% { transform: scale(1) rotate(-2deg); }
    50% { transform: scale(1.04) rotate(2deg); }
    100% { transform: scale(1) rotate(-2deg); }
  }
`;
const subtlePulse = `
  @keyframes subtlePulse {
    0% { opacity: 1; }
    50% { opacity: 0.82; }
    100% { opacity: 1; }
  }
`;
const neonFlicker = `
  @keyframes neonFlicker {
    0%, 100% { opacity: 1; }
    2% { opacity: 0.85; }
    4% { opacity: 1; }
    19% { opacity: 0.95; }
    21% { opacity: 1; }
    23% { opacity: 0.9; }
    25% { opacity: 1; }
  }
`;
const colorShift = `
  @keyframes colorShift {
    0% { color: #fff; }
    30% { color: #a259ff; }
    60% { color: #00fff0; }
    100% { color: #ff75d8; }
  }
`;

// Inject keyframes into the document (for styled-components)
if (typeof window !== "undefined" && !document.getElementById("nfpage-keyframes")) {
  const style = document.createElement("style");
  style.id = "nfpage-keyframes";
  style.innerHTML = slowScaleRotate + subtlePulse + neonFlicker + colorShift;
  document.head.appendChild(style);
}

const GlitchTitle = styled(motion.h1)`
  font-size: 12rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
  text-shadow:
    0 0 10px var(--color-accent),
    0 0 20px var(--color-accent),
    3px 3px 0px var(--color-primary);
  animation: slowScaleRotate 7s cubic-bezier(0.77, 0, 0.18, 1) infinite;

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
  color: #ff75d8;
  text-shadow:
    0 0 8px #ff75d8,
    0 0 24px #ff75d8,
    0 0 40px #a259ff,
    0 0 2px var(--color-secondary);
  filter: contrast(1.2) brightness(1.1);
  animation: subtlePulse 2.8s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const GlitchText = styled(motion.p)`
  font-size: 1.8rem;
  max-width: 60rem;
  margin-bottom: 3rem;
  color: #00fff0;
  text-shadow:
    0 0 6px #00fff0,
    0 0 18px #00fff0,
    0 0 32px #a259ff,
    0 0 2px var(--color-text);
  /* animation:
    neonFlicker 2.2s infinite alternate,
    colorShift 6s infinite linear; */

  @media (max-width: 768px) {
    font-size: 1.6rem;
    max-width: 100%;
    padding: 0 1rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    width: 100%;
    line-height: 1.6;
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
  transition:
    all 0.3s cubic-bezier(0.77, 0, 0.18, 1),
    border-color 0.2s;
  box-shadow:
    0 0 12px #00fff0,
    0 0 32px #a259ff,
    0 0 2px var(--color-primary);
  text-shadow:
    0 0 6px #00fff0,
    0 0 12px #a259ff;
  /* No infinite animation! */

  &:hover {
    transform: scale(1.07) rotate(-2deg);
    border-color: var(--color-accent);
    color: var(--color-accent);
    box-shadow:
      0 0 24px #00fff0,
      0 0 48px #a259ff,
      0 0 8px var(--color-accent),
      inset 0 0 18px rgba(0, 255, 240, 0.3);
  }
`;

// Neon harmonized GlitchSpan for this page only
const NeonGlitchSpan = styled(GlitchSpan)`
  color: #fff;
  text-shadow:
    0 0 8px #00fff0,
    0 0 18px #a259ff,
    0 0 32px #ff75d8,
    0 0 2px #fff;
  animation:
    neonFlicker 2.2s infinite alternate,
    colorShift 7s infinite linear;

  &::before,
  &::after {
    display: none !important;
  }
`;

// Add dramatic highlight spans for message text
const VioletSpan = styled.span`
  color: #a259ff;
  text-shadow:
    0 0 8px #a259ff,
    0 0 24px #ff75d8,
    0 0 32px #fff;
  /* animation: violetPulse 3.2s infinite alternate; */
  @keyframes violetPulse {
    0% {
      text-shadow:
        0 0 8px #a259ff,
        0 0 24px #ff75d8,
        0 0 32px #fff;
    }
    100% {
      text-shadow:
        0 0 18px #a259ff,
        0 0 32px #ff75d8,
        0 0 48px #fff;
    }
  }
`;
const CyanSpan = styled.span`
  color: #b3fff6;
  text-shadow:
    0 0 16px #b3fff6,
    0 0 32px #00fff0,
    0 0 48px #a259ff,
    0 0 8px #fff;
  /* animation: cyanPulse 3.5s infinite alternate; */
  @keyframes cyanPulse {
    0% {
      text-shadow:
        0 0 16px #b3fff6,
        0 0 32px #00fff0,
        0 0 48px #a259ff,
        0 0 8px #fff;
    }
    100% {
      text-shadow:
        0 0 28px #b3fff6,
        0 0 48px #00fff0,
        0 0 64px #a259ff,
        0 0 12px #fff;
    }
  }
`;

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || isCanvasLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // --- OFFSCREEN GRID CANVAS ---
    let gridCanvas: HTMLCanvasElement | null = null;
    let gridCtx: CanvasRenderingContext2D | null = null;
    const gridSize = 60;

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const parentHeight = canvas.parentElement
        ? canvas.parentElement.clientHeight
        : window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = parentHeight;
      // Recreate offscreen grid canvas
      gridCanvas = document.createElement("canvas");
      gridCanvas.width = window.innerWidth;
      gridCanvas.height = parentHeight;
      gridCtx = gridCanvas.getContext("2d");
      if (gridCtx) {
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        gridCtx.strokeStyle = "rgba(0, 255, 240, 0.1)";
        gridCtx.lineWidth = 1;
        for (let y = 0; y < gridCanvas.height; y += gridSize) {
          gridCtx.beginPath();
          gridCtx.moveTo(0, y);
          gridCtx.lineTo(gridCanvas.width, y);
          gridCtx.stroke();
        }
        for (let x = 0; x < gridCanvas.width; x += gridSize) {
          gridCtx.beginPath();
          gridCtx.moveTo(x, 0);
          gridCtx.lineTo(x, gridCanvas.height);
          gridCtx.stroke();
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- PARTICLES ---
    let particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      isTrail?: boolean;
      prevX?: number;
      prevY?: number;
    }[] = [];
    // --- DATA RAIN ---
    let rainDrops: { x: number; y: number; speed: number; length: number; color: string }[] = [];
    // --- GLYPHS ---
    const glyphs = ["λ", "Ξ", "Ψ", "Ж", "⟁", "✶", "⧫", "⟁", "⟟", "⧖", "⧊", "⧗", "⧉", "⧙"];
    let glyphFlash: { x: number; y: number; glyph: string; alpha: number; ttl: number } | null =
      null;

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.max(8, Math.floor(window.innerWidth / 120));
      const trailCount = Math.max(2, Math.floor(particleCount / 4));
      for (let i = 0; i < particleCount; i++) {
        const isTrail = i < trailCount;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isTrail ? Math.random() * 5 + 4 : Math.random() * 2 + 1,
          color: i % 3 === 0 ? "#a259ff" : i % 3 === 1 ? "#ff75d8" : "#00fff0",
          speed: Math.random() * 1 + 0.5,
          isTrail,
          prevX: undefined,
          prevY: undefined,
        });
      }
    };
    // Initialize data rain
    const initRain = () => {
      rainDrops = [];
      const rainCount = Math.floor(canvas.width / 80);
      for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1.5,
          length: Math.random() * 60 + 40,
          color: Math.random() > 0.5 ? "#00fff0" : "#a259ff",
        });
      }
    };
    initParticles();
    initRain();

    // Draw a grid effect (now just blits the offscreen grid)
    const drawGrid = () => {
      if (!ctx || !gridCanvas) return;
      ctx.drawImage(gridCanvas, 0, 0);
    };
    // Draw scanlines
    const drawScanlines = () => {
      if (!ctx) return;
      ctx.save();
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.globalAlpha = Math.random() > 0.97 ? 0.18 : 0.08;
        ctx.fillStyle = "#00fff0";
        ctx.fillRect(0, y, canvas.width, 1);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };
    // Draw data rain
    const drawDataRain = () => {
      if (!ctx) return;
      ctx.save();
      rainDrops.forEach((drop) => {
        ctx.beginPath();
        ctx.strokeStyle = drop.color;
        ctx.globalAlpha = 0.18 + Math.random() * 0.2;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.lineWidth = 2;
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      ctx.restore();
    };
    // Draw glyph flash
    const drawGlyphFlash = () => {
      if (!ctx || !glyphFlash) return;
      ctx.save();
      ctx.globalAlpha = glyphFlash.alpha;
      ctx.font = `bold 4rem 'Fira Mono', monospace`;
      ctx.fillStyle = "#ff75d8";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#a259ff";
      ctx.shadowBlur = 18;
      ctx.fillText(glyphFlash.glyph, glyphFlash.x, glyphFlash.y);
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    // Animation loop
    let frameCount = 0;
    // For throttling animation to 24fps
    let lastFrameTime = performance.now();
    const FRAME_DURATION = 1000 / 30; // Increase to 30fps for smoother experience
    // Random glitch effect that occasionally distorts the canvas
    const applyGlitchEffect = () => {
      if (!ctx || Math.random() > 0.03) return; // Reduced frequency to improve performance

      // Simplified glitch effect - less computation
      if (Math.random() > 0.7) {
        const blockCount = Math.floor(Math.random() * 3) + 1; // Reduced block count
        for (let i = 0; i < blockCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const width = Math.random() * 100 + 50;
          const height = Math.random() * 20 + 10;
          ctx.fillStyle = `rgba(${String(Math.random() * 255)}, ${String(Math.random() * 255)}, ${String(Math.random() * 255)}, 0.2)`;
          ctx.fillRect(x, y, width, height);
        }
      } else {
        // Only do pixel manipulation occasionally
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Process fewer pixels for better performance
        for (let i = 0; i < data.length; i += 16) {
          // Process every 4th pixel
          if (Math.random() > 0.95) {
            // Lower chance
            data[i] = data[i + 4] || data[i];
            data[i + 1] = data[i + 5] || data[i + 1];
            data[i + 2] = data[i + 6] || data[i + 2];
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };
    const animate = () => {
      if (!ctx) return;
      const now = performance.now();
      if (now - lastFrameTime < FRAME_DURATION) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = now;
      ctx.fillStyle = "rgba(10, 10, 20, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid(); // Disabled for CPU testing
      drawScanlines(); // Disabled for CPU testing
      drawDataRain();
      particles.forEach((particle) => {
        // Store previous position for trails
        if (particle.isTrail) {
          particle.prevX = particle.x;
          particle.prevY = particle.y;
        }
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
        // Draw trail for special particles
        if (particle.isTrail && particle.prevX !== undefined && particle.prevY !== undefined) {
          ctx.save();
          ctx.globalAlpha = 0.18;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(particle.prevX, particle.prevY);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.restore();
        }
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
      });
      drawGlyphFlash();
      // Only apply glitch effect every 5th frame
      if (frameCount % 5 === 0) {
        applyGlitchEffect();
      }
      ctx.shadowBlur = 0;
      // Occasionally trigger a glyph flash
      if (!glyphFlash && Math.random() > 0.995) {
        glyphFlash = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          alpha: 1,
          ttl: 30 + Math.random() * 30,
        };
      }
      // Animate glyph flash
      if (glyphFlash) {
        glyphFlash.ttl--;
        glyphFlash.alpha -= 0.03;
        if (glyphFlash.ttl <= 0 || glyphFlash.alpha <= 0) {
          glyphFlash = null;
        }
      }
      frameCount++;
      requestAnimationFrame(animate);
    };
    animate();
    setIsCanvasLoaded(true);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isCanvasLoaded]);

  return (
    <PageWrapper>
      <GlitchContainer>
        <GlitchCanvas ref={canvasRef} />
        <ContentWrapper>
          <GlitchTitle
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <NeonGlitchSpan>404</NeonGlitchSpan>
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
            style={{ filter: "contrast(1.1) brightness(1.05)" }}
          >
            <NeonGlitchSpan data-text="The coordinates you&apos;ve entered">
              The coordinates you&apos;ve entered
            </NeonGlitchSpan>{" "}
            don&apos;t exist in this realm.
            <br />
            <VioletSpan>Reality may have been altered</VioletSpan>, or{" "}
            <CyanSpan>signal fragmented</CyanSpan>.<br />
            Want to retrace your steps or explore uncharted code?
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
                Scan for Projects
              </GlitchButton>
            </StyledLink>
          </ButtonContainer>
        </ContentWrapper>
      </GlitchContainer>
    </PageWrapper>
  );
}
