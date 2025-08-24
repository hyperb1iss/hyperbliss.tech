'use client'

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { HeaderProvider } from './HeaderContext'
import { PageLoadProvider } from './PageLoadOrchestrator'

const theme = {}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <PageLoadProvider>
        <HeaderProvider>{children}</HeaderProvider>
      </PageLoadProvider>
    </ThemeProvider>
  )
}
