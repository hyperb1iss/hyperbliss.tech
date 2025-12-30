// app/lib/registry.tsx
'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React, { useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/**
 * StyledComponentsRegistry component
 * Provides server-side rendering support for styled-components in Next.js App Router.
 * Based on the official Next.js example.
 * CRITICAL: Must be at root level to capture all styled-components.
 */
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const isBrowser = typeof window !== 'undefined'

  // Only create the ServerStyleSheet on the server; client should use the default sheet.
  const [styledComponentsStyleSheet] = useState<ServerStyleSheet | null>(() => {
    return isBrowser ? null : new ServerStyleSheet()
  })

  useServerInsertedHTML(() => {
    if (!styledComponentsStyleSheet) return null
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  // Always render a StyleSheetManager so stylis options remain consistent between server/client.
  if (!styledComponentsStyleSheet) return <StyleSheetManager enableVendorPrefixes={true}>{children}</StyleSheetManager>

  return (
    <StyleSheetManager enableVendorPrefixes={true} sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
