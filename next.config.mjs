/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for highlighting potential issues
  reactStrictMode: true,

  // Ignore ESLint errors during production builds on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization domains and disable optimization buffer limit for large files
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
