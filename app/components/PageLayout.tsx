// app/components/PageLayout.tsx
import { motion } from 'framer-motion'
import { css } from '../../styled-system/css'

const mainContentWrapperStyles = css`
  flex: 1;
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-24) var(--space-12) var(--space-16);
  min-height: 100vh;
  position: relative;
  background: transparent;

  @media (max-width: 1200px) {
    padding: var(--space-20) var(--space-6) var(--space-12);
  }

  @media (max-width: 768px) {
    padding: var(--space-16) var(--space-4) var(--space-8);
  }
`

interface PageLayoutProps {
  children: React.ReactNode
}

/**
 * PageLayout component
 * Provides a consistent layout wrapper for page content with animations.
 * Adjusted styling for better widescreen support and responsiveness.
 * @param {PageLayoutProps} props - The component props
 * @returns {JSX.Element} Rendered page layout
 */
const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <motion.main
      animate={{ opacity: 1 }}
      className={mainContentWrapperStyles}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {children}
    </motion.main>
  )
}

export default PageLayout
