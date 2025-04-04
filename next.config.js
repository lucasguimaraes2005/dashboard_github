/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' since we're using API routes
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
  },
}

module.exports = nextConfig