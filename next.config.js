/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Removed standalone output to fix build errors on Windows
  // If you need standalone output for Docker deployment, uncomment below:
  // output: 'standalone',
};

export default nextConfig;
