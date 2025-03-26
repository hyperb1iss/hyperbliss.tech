/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  output: "standalone",
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  reactStrictMode: true,
  
  // Environment variables for analytics
  env: {
    GA_MEASUREMENT_ID: "G-2R4MW5X5SE",
    GA_DEBUG_MODE: process.env.NODE_ENV === "development" ? "true" : "false", 
  },
  
  // Configure headers for security and privacy
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
