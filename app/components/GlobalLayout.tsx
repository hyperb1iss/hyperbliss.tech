// app/components/GlobalLayout.tsx
'use client'

import React from 'react'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import Footer from './Footer'
import { useHeaderContext } from './HeaderContext'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const layoutContainerStyles = css`
  transition: padding-top 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--text-primary);
`

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface GlobalLayoutProps {
  children: React.ReactNode
}

/**
 * GlobalLayout component
 * Wraps the application content with global styles and header state.
 * Adjusts the padding based on the header expansion state.
 * Includes the Footer at the bottom of the page.
 */
const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { isExpanded } = useHeaderContext()

  // Dynamic padding based on header expansion
  const paddingTop = isExpanded ? '200px' : '100px'
  const paddingTopMobile = isExpanded ? '180px' : '80px'

  return (
    <div
      className={layoutContainerStyles}
      style={{
        paddingTop,
        // Will be overridden by media query in style tag
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .${layoutContainerStyles.split(' ')[0]} {
            padding-top: ${paddingTopMobile} !important;
          }
        }
      `}</style>
      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
    </div>
  )
}

export default GlobalLayout
