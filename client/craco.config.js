// client/craco.config.js

module.exports = {
    style: {
      postcss: {
        plugins: [
          require('@tailwindcss/postcss'),  // v4 用の PostCSS プラグイン
          require('autoprefixer'),
        ],
      },
    },
  };
  