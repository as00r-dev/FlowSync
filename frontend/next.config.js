/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack 5
  future: {
    webpack5: true,
  },
  // Fix for ES modules
  experimental: {
    esmExternals: true,
  },
  // Ensure CSS files are processed correctly
  webpack: (config, { isServer }) => {
    // For CSS files, ensure they're handled properly
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    });
    
    return config;
  }
};

module.exports = nextConfig;