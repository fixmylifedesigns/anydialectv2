/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_DISABLE_FILE_SYSTEM_ROUTING: 'true',
  },
  webpack: (config, { isServer }) => {
    // Disable all forms of webpack caching
    config.cache = false;
    config.optimization = {
      ...config.optimization,
      moduleIds: 'named',
      chunkIds: 'named',
      minimize: false  // Disable minimization during development
    };
    
    config.module.rules.push({
      test: /undici/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;