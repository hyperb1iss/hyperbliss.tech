'use client'

import { css } from '../../styled-system/css'
import ClientComponents from '../components/ClientComponents'
import GlobalLayout from '../components/GlobalLayout'
import Header from '../components/Header'
import { HeaderProvider } from '../components/HeaderContext'
import HyperspaceLoader from '../components/HyperspaceLoader'
import { PageLoadProvider } from '../components/PageLoadOrchestrator'

const skipLinkStyles = css`
  position: fixed;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 10000;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--silk-circuit-cyan);
  border-radius: var(--radius-md);
  background: var(--silk-void-black);
  color: var(--silk-circuit-cyan);
  transform: translateY(-200%);
  &:focus {
    transform: translateY(0);
  }
`

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLoadProvider>
      <HeaderProvider>
        <ClientComponents />
        <a className={skipLinkStyles} href="#main-content">
          Skip to content
        </a>
        <Header />
        <HyperspaceLoader />
        <GlobalLayout>{children}</GlobalLayout>
      </HeaderProvider>
    </PageLoadProvider>
  )
}
