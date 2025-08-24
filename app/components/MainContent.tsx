// app/components/MainContent.tsx
'use client'

import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

const MainContentWrapper = styled(motion.main)`
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
}

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
    <MainContentWrapper
      animate="animate"
      exit="exit"
      initial="initial"
      transition={pageTransition}
      variants={pageVariants}
    >
      {children}
    </MainContentWrapper>
  )
}

export default MainContent
