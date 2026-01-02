// app/components/StyledTitle.tsx
import { motion } from 'framer-motion'
import { css } from '../../styled-system/css'

const styledTitleStyles = css`
  font-size: clamp(2.2rem, 1.8vw, 3rem);
  color: #00ffff;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 2px;
  font-family: var(--font-heading);
  position: relative;
  padding: 0.5rem;
  background: linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
    background-size: 200% 100%;
    animation: shimmer 6s linear infinite;
    opacity: 0.5;
    z-index: -1;
  }

  &::after {
    filter: blur(10px);
    opacity: 0.3;
  }

  &:hover {
    box-shadow:
      0 0 20px rgba(0, 255, 255, 0.6),
      0 0 40px rgba(255, 0, 255, 0.4);
    border-color: #00ffff;

    &::before,
    &::after {
      opacity: 0.8;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`

interface StyledTitleProps {
  children: React.ReactNode
  isMobile?: boolean
}

const StyledTitle: React.FC<StyledTitleProps> = ({ children }) => {
  return <motion.h2 className={styledTitleStyles}>{children}</motion.h2>
}

export default StyledTitle
