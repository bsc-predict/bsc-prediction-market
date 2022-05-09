module.exports = {
  async redirects() {
    return [
      {
        source: '/bnbusdt',
        destination: '/ps/bnbusdt',
        permanent: true,
      },
    ]
  },

  reactStrictMode: true,
  images: {
    disableStaticImages: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    config.module.rules.push({test:  /\.md$/, use: 'raw-loader'})
    config.module.rules.push({test: /\.yml$/, use: 'raw-loader'})

    return config;
  },
}
