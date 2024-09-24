// app/components/SeoWrapper.tsx
"use client";

import { DefaultSeo } from "next-seo";
import SEO from "../lib/next-seo.config";

export default function SeoWrapper() {
  return <DefaultSeo {...SEO} />;
}
