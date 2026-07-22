/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,

  // Environment variables for analytics
  env: {
    GA_DEBUG_MODE: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    GA_MEASUREMENT_ID: 'G-2R4MW5X5SE',
    NEXT_PUBLIC_TERMINAL_HERO: process.env.NEXT_PUBLIC_TERMINAL_HERO ?? 'true',
    NEXT_PUBLIC_WEBMCP: process.env.NEXT_PUBLIC_WEBMCP ?? 'true',
    // Agent-driven shell exec is opt-in: a remote-exec-shaped tool should never
    // default on, even though it runs in the just-bash wasm sandbox.
    NEXT_PUBLIC_WEBMCP_SHELL: process.env.NEXT_PUBLIC_WEBMCP_SHELL ?? 'false',
  },
  generateEtags: false,

  // Configure headers for security and privacy
  async headers() {
    const immutableAssetHeaders =
      process.env.NODE_ENV === 'production'
        ? ['/images/:path*', '/fonts/:path*'].map((source) => ({
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            source,
          }))
        : []
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
            value: 'camera=(), microphone=(), geolocation=(), tools=(self)',
          },
        ],
        source: '/(.*)',
      },
      ...immutableAssetHeaders,
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

  // Ensure consistent URL format (with or without trailing slashes)
  trailingSlash: true,

  turbopack: {},

  typescript: {
    // TypeScript 7 (native compiler) has no JS API, which next's in-build type
    // check needs until 16.3's useTypeScriptCli lands. Types gate via
    // `pnpm typecheck` in CI instead.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
