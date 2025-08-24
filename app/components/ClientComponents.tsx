'use client'

import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('./Analytics'), {
  ssr: false,
})

const SeoWrapper = dynamic(() => import('./SeoWrapper'), {
  ssr: false,
})

/**
 * ClientComponents
 * A client component that handles dynamic imports with ssr: false
 * @returns {JSX.Element} Rendered client components
 */
export default function ClientComponents() {
  return (
    <>
      <SeoWrapper />
      <Analytics />
    </>
  )
}
