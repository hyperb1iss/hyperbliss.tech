// app/components/Analytics.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { event, GoogleAnalytics, usePageViews } from 'nextjs-google-analytics'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''
const GA_DEBUG_MODE = process.env.NEXT_PUBLIC_GA_DEBUG_MODE === 'true'

/**
 * Analytics component
 * Implements Google Analytics tracking for the application
 * with enhanced tracking for referrers, user journey, and events.
 * @returns {JSX.Element} Google Analytics component
 */
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Enable basic page view tracking
  usePageViews({
    ignoreHashChange: true,
  })

  // Track when URL parameters change
  useEffect(() => {
    if (searchParams?.toString()) {
      const params = Object.fromEntries(searchParams.entries())

      // Track search parameters as custom event
      event('search_params', {
        page_path: pathname,
        params_json: JSON.stringify(params),
      })
    }
  }, [searchParams, pathname])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <GoogleAnalytics
      debugMode={GA_DEBUG_MODE}
      gaMeasurementId={GA_MEASUREMENT_ID}
      strategy="lazyOnload"
      trackPageViews={true}
    />
  )
}

// Exporting the event function for custom event tracking throughout the app
export { event as trackEvent }
