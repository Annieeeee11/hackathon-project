/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  output: 'standalone',
};

export default nextConfig;
