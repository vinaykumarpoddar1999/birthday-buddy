const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver ?? {};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  /node_modules[\\/].*expo-image-manipulator.*[\\/].*\.dSYM[\\/].*/,
];

module.exports = withNativeWind(config, { input: './src/global.css' });
