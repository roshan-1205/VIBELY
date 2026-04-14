/** @type {import('next').NextConfig} */
const nextConfig = {
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