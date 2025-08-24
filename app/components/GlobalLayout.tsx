// app/components/GlobalLayout.tsx
'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import styled from 'styled-components'
import { useHeaderContext } from './HeaderContext'

// Import StaticFooter by default for initial page load
import StaticFooter from './StaticFooter'

// Lazy load the animated Footer for enhanced experience after page load
const AnimatedFooter = dynamic(() => import('./Footer'), {
  loading: () => <StaticFooter />,
  ssr: false,
})

const LayoutContainer = styled.div<{ $isHeaderExpanded: boolean }>`
  padding-top: ${(props) => (props.$isHeaderExpanded ? '200px' : '100px')};
  transition: padding-top 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-top: ${(props) => (props.$isHeaderExpanded ? '180px' : '80px')};
  }
`

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`

interface GlobalLayoutProps {
  children: React.ReactNode
}

/**
 * GlobalLayout component
 * Wraps the application content with global styles and header state.
 * Adjusts the padding based on the header expansion state.
 * Includes the Footer at the bottom of the page.
 * @param {GlobalLayoutProps} props - The component props
 * @returns {JSX.Element} Rendered global layout
 */
const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { isExpanded } = useHeaderContext()
  const [isAnimatedFooterLoaded, setIsAnimatedFooterLoaded] = React.useState(false)

  // After a delay, load the animated footer instead
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatedFooterLoaded(true)
    }, 2000) // Delay loading animated footer for better performance

    return () => clearTimeout(timer)
  }, [])

  return (
    <LayoutContainer $isHeaderExpanded={isExpanded}>
      <ContentWrapper>{children}</ContentWrapper>
      {isAnimatedFooterLoaded ? <AnimatedFooter /> : <StaticFooter />}
    </LayoutContainer>
  )
}

export default GlobalLayout
