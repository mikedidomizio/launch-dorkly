/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    testProxy: true,
  },
  eslint: {
    dirs: ['src', 'tests'], // by default it won't check the tests directory
  },
}

module.exports = nextConfig
