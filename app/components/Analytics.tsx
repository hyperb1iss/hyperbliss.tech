// app/components/Analytics.tsx
"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

/**
 * Analytics component
 * Implements Google Analytics tracking for the application.
 * @returns {JSX.Element} Google Analytics component
 */
export default function Analytics() {
  return <GoogleAnalytics trackPageViews gaMeasurementId="G-2R4MW5X5SE" />;
}
