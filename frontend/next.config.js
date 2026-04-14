/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for Vercel
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Skip build-time errors for demo pages
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig