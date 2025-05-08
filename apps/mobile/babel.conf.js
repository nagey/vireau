// babel.config.js (at apps/mobile or project root)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],    // ← this is essential for className support
  };
};
