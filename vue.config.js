module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'es',
      fallbackLocale: 'es',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
  },
};
