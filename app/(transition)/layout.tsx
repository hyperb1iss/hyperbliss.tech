'use client'

import ClientComponents from '../components/ClientComponents'
import GlobalLayout from '../components/GlobalLayout'
import Header from '../components/Header'
import { HeaderProvider } from '../components/HeaderContext'
import HeaderFade from '../components/HeaderFade'
import HyperspaceLoader from '../components/HyperspaceLoader'
import { PageLoadProvider } from '../components/PageLoadOrchestrator'

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
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
