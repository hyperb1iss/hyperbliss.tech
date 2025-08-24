// app/components/PageTitle.tsx
import { motion } from 'framer-motion'
import styled from 'styled-components'

const TitleWrapper = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: var(--text-fluid-4xl);
  font-weight: var(--font-black);
  text-align: center;
  margin-bottom: var(--space-12);
  line-height: var(--leading-tight);
  background: linear-gradient(
    135deg,
    var(--silk-quantum-purple) 0%,
    var(--silk-circuit-cyan) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  @media (max-width: 768px) {
    font-size: var(--text-fluid-3xl);
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
    <TitleWrapper
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </TitleWrapper>
  )
}

export default PageTitle
