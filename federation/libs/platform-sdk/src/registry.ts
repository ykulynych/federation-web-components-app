import type { PlatformSdk } from './types';

let sdk: PlatformSdk | undefined;

/** Called once by the shell. Remotes only ever call getPlatformSdk(). */
export function setPlatformSdk(instance: PlatformSdk): void {
  sdk = instance;
}

export function getPlatformSdk(): PlatformSdk {
  if (!sdk) {
    throw new Error('PlatformSdk is not available: the shell has not registered it yet.');
  }
  return sdk;
}
