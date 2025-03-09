import {getDefaultConfig, mergeConfig} from '@react-native/metro-config';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf'],
  },
};

export default mergeConfig(getDefaultConfig(__dirname), config);
