'use client'

import React from 'react'
import { HeaderProvider } from './HeaderContext'
import { PageLoadProvider } from './PageLoadOrchestrator'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PageLoadProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </PageLoadProvider>
  )
}
