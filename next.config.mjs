/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Temporarily disabled due to critters module issue
  },

  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations (disabled for Turbopack compatibility)
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },

  // Advanced bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enhanced production optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Three.js and heavy 3D libraries
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'async',
            priority: 20,
          },
          // Framer Motion animations
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer',
            chunks: 'async',
            priority: 15,
          },
          // UI icons
          icons: {
            test: /[\\/]node_modules[\\/]@tabler[\\/]icons-react[\\/]/,
            name: 'icons',
            chunks: 'async',
            priority: 12,
          },
          // Common utilities
          common: {
            minChunks: 2,
            chunks: 'all',
            name: 'common',
            priority: 5,
          },
        },
      };
      
      // Additional optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },

  // Enable static optimization
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;