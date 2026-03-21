module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': './src',
        '@screens': './src/screens',
        '@components': './src/components',
        '@services': './src/services',
        '@db': './src/db',
        '@utils': './src/utils',
        '@constants': './src/constants',
        '@hooks': './src/hooks',
        '@types': './src/types',
        '@config': './src/config',
      }
    }],
    'react-native-reanimated/plugin'
  ],
};
