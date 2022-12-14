/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "via.placeholder.com", "fakestoreapi.com"],
  },
};

module.exports = nextConfig;
