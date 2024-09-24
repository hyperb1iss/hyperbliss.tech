// app/components/Analytics.tsx
"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

export default function Analytics() {
  return <GoogleAnalytics trackPageViews gaMeasurementId="G-2R4MW5X5SE" />;
}
