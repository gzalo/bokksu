module.exports = {
  publicPath: '',
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          target: [
            {
              target: 'portable',
            },
          ],
        },
      },
    },
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
        target: 'http://localhost:3001/',
        ws: true,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
  },
};
