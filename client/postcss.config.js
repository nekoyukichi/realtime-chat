// client/postcss.config.js

module.exports = {
    plugins: [
      require('@tailwindcss/postcss'),   // ← 必ず配列で require() を並べる
      require('autoprefixer'),
    ],
  };
  