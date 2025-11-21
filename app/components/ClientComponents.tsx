'use client'

import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('./Analytics'), {
  ssr: false,
})

/**
 * ClientComponents
 * A client component that handles dynamic imports with ssr: false
 * @returns {JSX.Element} Rendered client components
 */
export default function ClientComponents() {
  return <Analytics />
}
