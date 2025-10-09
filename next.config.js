/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'pbs.twimg.com', 'abs.twimg.com'],
  },
  output: 'standalone',
}

module.exports = nextConfig
