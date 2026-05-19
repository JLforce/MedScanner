module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blocklist": null,
      "allowlist": null,
      "safe": false,
      "allowUndefined": false,
      "verbose": false
    }],
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