import { withNativeFederation, shareAll } from '@softarc/native-federation/config';
import { REACT_SKIP_LIST } from '@softarc/native-federation-esbuild/frameworks/react';

const singleton = { singleton: true, strictVersion: true, requiredVersion: 'auto' };

export default withNativeFederation({
  name: 'react-app',

  exposes: {
    './mount': './src/mount.tsx',
  },

  sharedMappings: [[['@demo/platform-sdk'], { singleton: true, strictVersion: false }]],

  shared: {
    ...shareAll(singleton, {
      skipList: REACT_SKIP_LIST,
      overrides: {
        react: { ...singleton, includeSecondaries: { keepAll: true } },
        'react-dom': { ...singleton, includeSecondaries: { keepAll: true } },
      },
    }),
  },

  features: { ignoreUnusedDeps: false },
});
