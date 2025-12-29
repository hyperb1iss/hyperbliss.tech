/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      displayName: true,
      fileName: true,
      minify: false,
      pure: true,
      ssr: true,
      transpileTemplateLiterals: true,
    },
  },
  compress: true,

  // Environment variables for analytics
  env: {
    GA_DEBUG_MODE: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    GA_MEASUREMENT_ID: 'G-2R4MW5X5SE',
  },
  generateEtags: false,

  // Configure headers for security and privacy
  async headers() {
    return [
      {
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
        source: '/(.*)',
      },
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
        source: '/images/:path*',
      },
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
        source: '/_next/static/:path*',
      },
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
        source: '/fonts/:path*',
      },
    ]
  },

  // Image optimization configuration
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ['image/avif', 'image/webp'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      // Add patterns for any remote images
      {
        hostname: '**',
        protocol: 'https',
      },
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  // Rewrites for TinaCMS admin
  async rewrites() {
    return [
      {
        destination: '/admin/index.html',
        source: '/admin/',
      },
    ]
  },

  // Ensure consistent URL format (with or without trailing slashes)
  trailingSlash: true,
}
export default nextConfig
