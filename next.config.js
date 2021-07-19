module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    BSC_API_KEY: process.env.BSC_API_KEY,
  },
  images: {
    disableStaticImages: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
}
