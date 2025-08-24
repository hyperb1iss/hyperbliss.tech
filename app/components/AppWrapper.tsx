'use client'

import React from 'react'
import ClientComponents from './ClientComponents'
import GlobalLayout from './GlobalLayout'
import Header from './Header'
import { HeaderProvider } from './HeaderContext'
import HeaderFade from './HeaderFade'
import HyperspaceLoader from './HyperspaceLoader'
import { PageLoadProvider } from './PageLoadOrchestrator'

function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PageLoadProvider>
      <HeaderProvider>
        <ClientComponents />
        <Header />
        <HeaderFade />
        <HyperspaceLoader />
        <GlobalLayout>{children}</GlobalLayout>
      </HeaderProvider>
    </PageLoadProvider>
  )
}

export default AppWrapper
