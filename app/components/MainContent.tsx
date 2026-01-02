// app/components/MainContent.tsx
'use client'

import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'
import { css } from '../../styled-system/css'

const mainContentWrapperStyles = css`
  flex: 1;
  padding-top: 10px;
`

const pageVariants = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  initial: { opacity: 0, y: 20 },
}

const pageTransition = {
  duration: 0.5,
  ease: 'anticipate',
  type: 'tween',
} as const

interface MainContentProps {
  children: ReactNode
}

/**
 * MainContent component
 * Wraps the main content of each page with animation effects.
 * @param {MainContentProps} props - The component props
 * @returns {JSX.Element} Animated main content wrapper
 */
const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <motion.main
      animate="animate"
      className={mainContentWrapperStyles}
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      {children}
    </motion.main>
  )
}

export default MainContent
