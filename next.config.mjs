/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for highlighting potential issues
  reactStrictMode: true,

  // Image optimization domains and disable optimization buffer limit for large files
  images: {
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
