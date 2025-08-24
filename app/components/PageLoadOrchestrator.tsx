'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface PageLoadContextType {
  isInitialLoad: boolean
  hasLoaded: boolean
  markAsLoaded: () => void
}

const PageLoadContext = createContext<PageLoadContextType>({
  hasLoaded: false,
  isInitialLoad: true,
  markAsLoaded: () => {},
})

export const usePageLoad = () => useContext(PageLoadContext)

export function PageLoadProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Check if this is a return visit using sessionStorage
    const hasVisited = sessionStorage.getItem('hasVisited')

    if (!hasVisited) {
      // First visit in this session
      sessionStorage.setItem('hasVisited', 'true')

      // Mark as loaded after initial animations complete
      const timer = setTimeout(() => {
        setHasLoaded(true)
        setIsInitialLoad(false)
      }, 1000) // Matches our animation duration

      return () => clearTimeout(timer)
    }
    // Return visit - skip initial animations
    setIsInitialLoad(false)
    setHasLoaded(true)
  }, [])

  const markAsLoaded = () => {
    setHasLoaded(true)
    setIsInitialLoad(false)
  }

  return (
    <PageLoadContext.Provider value={{ hasLoaded, isInitialLoad, markAsLoaded }}>{children}</PageLoadContext.Provider>
  )
}
