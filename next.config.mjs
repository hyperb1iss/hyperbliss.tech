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
};
export default nextConfig;
