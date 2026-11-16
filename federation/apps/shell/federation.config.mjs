import {
  withNativeFederation,
  fromPackageJson,
} from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'shell',

  sharedMappings: [[['@demo/platform-sdk'], { singleton: true, strictVersion: false }]],

  shared: fromPackageJson({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
    build: 'package',
  })
    // includeSecondaries is an opt-out of ignoreUnusedDeps, so all of
    // @angular/core is shared to prevent mismatches.
    .patch(['@angular/core'], { includeSecondaries: { keepAll: true } }),

  skip: [
    /^@angular\/(cdk|material)\/schematics/,
    '@angular-architects/native-federation',
    '@softarc/native-federation-orchestrator',
    'es-module-shims',
    '@angular/platform-browser/animations',
    '@angular/platform-browser/animations/async',
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // Disabled: its import scan cannot follow the workspace lib outside the app root.
    ignoreUnusedDeps: false,

    // Opt-in: groups chunks in remoteEntry.json for smaller metadata file
    denseChunking: true,
  },
});
