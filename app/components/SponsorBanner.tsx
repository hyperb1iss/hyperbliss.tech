'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaHeart } from 'react-icons/fa6'
import { css } from '../../styled-system/css'

const bannerStyles = css`
  margin: var(--space-12) auto;
  max-width: 680px;
  padding: var(--space-8) var(--space-8);
  border-radius: var(--radius-xl);
  background: linear-gradient(
    135deg,
    rgba(255, 117, 216, 0.06) 0%,
    rgba(162, 89, 255, 0.04) 50%,
    rgba(0, 255, 240, 0.03) 100%
  );
  border: 1px solid rgba(255, 117, 216, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--space-8);
    right: var(--space-8);
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 117, 216, 0.4), transparent);
  }

  @media (max-width: 768px) {
    margin: var(--space-8) var(--space-4);
    padding: var(--space-6);
  }
`

const heartStyles = css`
  font-size: 2rem;
  color: #ff75d8;
  margin-bottom: var(--space-3);
  filter: drop-shadow(0 0 10px rgba(255, 117, 216, 0.5));
  animation: heartbeat 2s ease-in-out infinite;

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.1); }
    60% { transform: scale(1); }
  }
`

const titleStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-lg);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, #ff75d8, #c084fc, #00fff0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--space-2);
`

const descStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-5);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: var(--font-semibold);
  color: #1e1b2e;
  background: linear-gradient(135deg, #ff75d8, #c084fc);
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-silk);
  box-shadow:
    0 4px 15px rgba(255, 117, 216, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 8px 25px rgba(255, 117, 216, 0.4),
      0 0 40px rgba(192, 132, 252, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 1.3rem;
  }
`

export default function SponsorBanner() {
  return (
    <motion.div
      className={bannerStyles}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className={heartStyles}>
        <FaHeart />
      </div>
      <div className={titleStyles}>Support My Work</div>
      <p className={descStyles}>
        If you dig these projects and experiments, sponsoring helps me keep building weird and wonderful open source
        things.
      </p>
      <motion.a
        className={buttonStyles}
        href="https://github.com/sponsors/hyperb1iss"
        rel="noopener noreferrer"
        target="_blank"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaGithub /> Sponsor on GitHub
      </motion.a>
    </motion.div>
  )
}
