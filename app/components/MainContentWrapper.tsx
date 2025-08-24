// app/components/MainContentWrapper.tsx
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'
import { useHeaderContext } from './HeaderContext'

const StyledWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
`

/**
 * MainContentWrapper component
 * Adjusts padding based on header expansion state.
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Rendered content wrapper
 */
const MainContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded } = useHeaderContext()

  return (
    <StyledWrapper
      animate={{ paddingTop: isExpanded ? '160px' : '80px' }}
      initial={false}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </StyledWrapper>
  )
}

export default MainContentWrapper
