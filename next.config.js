/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  eslint: {
    dirs: ['src', 'tests'], // by default it won't check the tests directory
  },
}

module.exports = nextConfig
