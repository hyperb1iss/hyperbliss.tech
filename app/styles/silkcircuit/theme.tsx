/**
 * SilkCircuit Theme Provider
 * Manages theme state and provides theme context
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { tokens } from './tokens'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ThemeMode = 'dark' | 'light' | 'system'
export type ContrastMode = 'normal' | 'high'

interface ThemeContextValue {
  mode: ThemeMode
  contrast: ContrastMode
  setMode: (mode: ThemeMode) => void
  setContrast: (contrast: ContrastMode) => void
  toggleMode: () => void
  effectiveMode: 'dark' | 'light'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Context
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within SilkCircuitProvider')
  }
  return context
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Provider Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SilkCircuitProviderProps {
  children: React.ReactNode
  defaultMode?: ThemeMode
  defaultContrast?: ContrastMode
}

export function SilkCircuitProvider({
  children,
  defaultMode = 'dark',
  defaultContrast = 'normal',
}: SilkCircuitProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode)
  const [contrast, setContrast] = useState<ContrastMode>(defaultContrast)
  const [effectiveMode, setEffectiveMode] = useState<'dark' | 'light'>('dark')

  // Handle system preference changes
  useEffect(() => {
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveMode(e.matches ? 'dark' : 'light')
      }

      // Set initial value
      setEffectiveMode(mediaQuery.matches ? 'dark' : 'light')

      // Listen for changes
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    setEffectiveMode(mode as 'dark' | 'light')
  }, [mode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    // Remove all theme classes
    root.removeAttribute('data-theme')
    root.removeAttribute('data-contrast')

    // Apply new theme
    root.setAttribute('data-theme', effectiveMode)
    if (contrast === 'high') {
      root.setAttribute('data-contrast', 'high')
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveMode === 'dark' ? '#0a0a14' : '#f8fafc')
    }
  }, [effectiveMode, contrast])

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('silkcircuit-theme-mode', mode)
      localStorage.setItem('silkcircuit-theme-contrast', contrast)
    } catch (e) {
      // Handle localStorage errors gracefully
      console.warn('Unable to save theme preferences:', e)
    }
  }, [mode, contrast])

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('silkcircuit-theme-mode') as ThemeMode
      const savedContrast = localStorage.getItem('silkcircuit-theme-contrast') as ContrastMode

      if (savedMode) setMode(savedMode)
      if (savedContrast) setContrast(savedContrast)
    } catch (e) {
      // Handle localStorage errors gracefully
      console.warn('Unable to load theme preferences:', e)
    }
  }, [])

  const toggleMode = () => {
    setMode((prev) => {
      const modes: ThemeMode[] = ['dark', 'light', 'system']
      const currentIndex = modes.indexOf(prev)
      return modes[(currentIndex + 1) % modes.length]
    })
  }

  const contextValue: ThemeContextValue = {
    contrast,
    effectiveMode,
    mode,
    setContrast,
    setMode,
    toggleMode,
  }

  // Create styled-components theme object
  const styledTheme = {
    ...tokens,
    contrast,
    mode: effectiveMode,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={styledTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Theme Toggle Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ThemeToggle() {
  const { mode, effectiveMode, toggleMode } = useTheme()

  const icons = {
    dark: (
      <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    light: (
      <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" x2="12" y1="1" y2="3" />
        <line x1="12" x2="12" y1="21" y2="23" />
        <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
        <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
        <line x1="1" x2="3" y1="12" y2="12" />
        <line x1="21" x2="23" y1="12" y2="12" />
        <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
        <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
      </svg>
    ),
    system: (
      <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
        <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
  }

  return (
    <button
      aria-label={`Switch to ${mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark'} mode`}
      className="theme-toggle"
      onClick={toggleMode}
      style={{
        alignItems: 'center',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        padding: 'var(--space-2)',
        transition: 'all var(--duration-fast) var(--ease-silk)',
      }}
    >
      {icons[mode === 'system' ? 'system' : effectiveMode]}
    </button>
  )
}
