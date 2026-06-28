// app/components/HeaderContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

/**
 * Interface for HeaderContext
 * Provides state management for the header's expanded state.
 */
interface HeaderContextType {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  // The terminal pull-down console. Kept separate from isExpanded so opening the
  // console never triggers the nav-height/content-padding machinery that
  // isExpanded drives across GlobalLayout, MainContentWrapper, and HeaderFade.
  isConsoleOpen: boolean
  setConsoleOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * HeaderContext
 * React context for managing the header's expanded state.
 */
const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

/**
 * useHeaderContext hook
 * Provides access to the HeaderContext.
 * @returns {HeaderContextType} The context value
 * @throws Error if used outside of HeaderProvider
 */
export const useHeaderContext = () => {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeaderContext must be used within a HeaderProvider')
  }
  return context
}

/**
 * HeaderProvider component
 * Wraps the application and provides the header context.
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Provider component
 */
export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConsoleOpen, setConsoleOpen] = useState(false)

  return (
    <HeaderContext.Provider value={{ isConsoleOpen, isExpanded, setConsoleOpen, setIsExpanded }}>
      {children}
    </HeaderContext.Provider>
  )
}
