'use client'

import { AnimatePresence } from 'framer-motion'
import GlobalLayout from './GlobalLayout'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLayout>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </GlobalLayout>
  )
}
