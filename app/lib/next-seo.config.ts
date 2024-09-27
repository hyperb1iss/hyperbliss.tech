// app/lib/next-seo.config.ts
import { DefaultSeoProps } from "next-seo";
import siteMetadata from "../lib/metadata";
import { OpenGraphMedia } from "next-seo/lib/types";

/**
 * Type definition for the title metadata structure
 */
type TitleMetadata = {
  template?: string;
  default?: string;
};

/**
 * Configuration object for next-seo
 * Sets up default SEO properties based on the site metadata
 */
const config: DefaultSeoProps = {
  titleTemplate: (siteMetadata.title as TitleMetadata)?.template ?? "",
  defaultTitle: (siteMetadata.title as TitleMetadata)?.default ?? "",
  description: siteMetadata.description ?? "",
  openGraph: {
    ...siteMetadata.openGraph,
    url: (siteMetadata.openGraph?.url as string) ?? "",
    title: (siteMetadata.openGraph?.title as string) ?? "",
    description: siteMetadata.openGraph?.description ?? "",
    images: Array.isArray(siteMetadata.openGraph?.images)
      ? (siteMetadata.openGraph?.images as readonly OpenGraphMedia[])
      : undefined,
    videos: Array.isArray(siteMetadata.openGraph?.videos)
      ? (siteMetadata.openGraph?.videos as readonly OpenGraphMedia[])
      : undefined,
    audio: Array.isArray(siteMetadata.openGraph?.audio)
      ? (siteMetadata.openGraph?.audio as readonly OpenGraphMedia[])
      : undefined,
  },
};

export default config;
