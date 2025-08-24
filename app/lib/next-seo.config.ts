// app/lib/next-seo.config.ts
import { DefaultSeoProps } from 'next-seo'
import { OpenGraphMedia } from 'next-seo/lib/types'
import siteMetadata from '../lib/metadata'

/**
 * Type definition for the title metadata structure
 */
type TitleMetadata = {
  template?: string
  default?: string
}

/**
 * Configuration object for next-seo
 * Sets up default SEO properties based on the site metadata
 */
const config: DefaultSeoProps = {
  defaultTitle: (siteMetadata.title as TitleMetadata)?.default ?? '',
  description: siteMetadata.description ?? '',
  openGraph: {
    ...siteMetadata.openGraph,
    audio: Array.isArray(siteMetadata.openGraph?.audio)
      ? (siteMetadata.openGraph?.audio as readonly OpenGraphMedia[])
      : undefined,
    description: siteMetadata.openGraph?.description ?? '',
    images: Array.isArray(siteMetadata.openGraph?.images)
      ? (siteMetadata.openGraph?.images as readonly OpenGraphMedia[])
      : undefined,
    title: (siteMetadata.openGraph?.title as string) ?? '',
    url: (siteMetadata.openGraph?.url as string) ?? '',
    videos: Array.isArray(siteMetadata.openGraph?.videos)
      ? (siteMetadata.openGraph?.videos as readonly OpenGraphMedia[])
      : undefined,
  },
  titleTemplate: (siteMetadata.title as TitleMetadata)?.template ?? '',
}

export default config
