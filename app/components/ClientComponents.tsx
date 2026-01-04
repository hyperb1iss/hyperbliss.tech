'use client'

import { Suspense } from 'react'
import Analytics from './Analytics'

/**
 * ClientComponents
 * A client component wrapper for client-only components
 * @returns {JSX.Element} Rendered client components
 */
export default function ClientComponents() {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  )
}
