module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@src': './src',
            // modules: './src/modules',
            // lib: './src/lib',
            // types: './src/types',
            '@constants': './src/constants',
          },
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        },
      ],
    ],
  };
};
