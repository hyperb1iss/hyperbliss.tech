// app/lib/registry.tsx
'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React, { useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * StyledComponentsRegistry component
 * Provides server-side rendering support for styled-components
 * CRITICAL: Must be at root level to capture all styled-components
 * Fixes hydration issues and ensures proper style loading during navigation
 * @param children - The child components to be wrapped
 * @returns A component with styled-components server-side rendering support
 */
const filterTransientProps = (prop?: string) => {
  if (!prop) return true
  if (prop.startsWith('$')) return false
  if (['as', 'theme', 'forwardedAs'].includes(prop)) return false
  return true
}

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') {
    return <StyleSheetManager shouldForwardProp={filterTransientProps}>{children}</StyleSheetManager>
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} shouldForwardProp={filterTransientProps}>
      {children}
    </StyleSheetManager>
  )
}
