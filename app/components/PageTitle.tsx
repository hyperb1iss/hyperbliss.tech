// app/components/PageTitle.tsx
import { motion } from 'framer-motion'
import { css } from '../../styled-system/css'

const titleWrapperStyles = css`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-5xl);
  font-weight: var(--font-black);
  text-align: center;
  margin-bottom: var(--space-10);
  line-height: var(--leading-tight);
  background: linear-gradient(
    135deg,
    #00fff0 0%,
    #e0aaff 20%,
    #d946ef 40%,
    #ff75d8 60%,
    #a855f7 80%,
    #00fff0 100%
  );
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  position: relative;
  animation: gradientShift 6s ease infinite;
  filter: drop-shadow(0 0 15px rgba(0, 255, 240, 0.3))
          drop-shadow(0 0 25px rgba(224, 170, 255, 0.2))
          drop-shadow(0 0 20px rgba(255, 117, 216, 0.18));

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @media (max-width: 768px) {
    font-size: var(--text-fluid-4xl);
    margin-bottom: var(--space-8);
  }
`

interface PageTitleProps {
  children: React.ReactNode
}

/**
 * PageTitle component
 * Renders a page title with animation effects.
 * @param {PageTitleProps} props - The component props
 * @returns {JSX.Element} Animated page title
 */
const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return (
    <motion.h1
      animate={{ opacity: 1, y: 0 }}
      className={titleWrapperStyles}
      initial={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.h1>
  )
}

export default PageTitle
