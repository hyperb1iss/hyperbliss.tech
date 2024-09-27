// app/components/SeoWrapper.tsx
"use client";

import { DefaultSeo } from "next-seo";
import SEO from "../lib/next-seo.config";

/**
 * SeoWrapper component
 * Applies default SEO configuration to the entire application.
 * @returns {JSX.Element} DefaultSeo component with configuration
 */
export default function SeoWrapper() {
  return <DefaultSeo {...SEO} />;
}
