/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: (process.env.NEXT_PUBLIC_APP_SUBDIR ? '/' + process.env.NEXT_PUBLIC_APP_SUBDIR : ''),
  distDir: 'dist',
  output: 'export',
  env: {
    // Make environment variables available to the client
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_DOMAIN_NAME: process.env.NEXT_PUBLIC_APP_DOMAIN_NAME,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
  },

}

export default nextConfig
