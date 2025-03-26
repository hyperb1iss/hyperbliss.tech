// app/components/Analytics.tsx
"use client";

import { GoogleAnalytics, usePageViews, event } from "nextjs-google-analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Analytics component
 * Implements Google Analytics tracking for the application
 * with enhanced tracking for referrers, user journey, and events.
 * @returns {JSX.Element} Google Analytics component
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Enable basic page view tracking
  usePageViews({
    ignoreHashChange: true,
  });

  // Track when URL parameters change
  useEffect(() => {
    if (searchParams && searchParams.toString()) {
      const params = Object.fromEntries(searchParams.entries());

      // Track search parameters as custom event
      event("search_params", {
        params_json: JSON.stringify(params),
        page_path: pathname,
      });
    }
  }, [searchParams, pathname]);

  return (
    <GoogleAnalytics
      trackPageViews
      gaMeasurementId={process.env.GA_MEASUREMENT_ID}
      strategy="lazyOnload"
      debugMode={process.env.GA_DEBUG_MODE === "true"}
    />
  );
}

// Exporting the event function for custom event tracking throughout the app
export { event as trackEvent };
