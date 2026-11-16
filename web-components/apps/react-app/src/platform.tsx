import { createContext, useContext, useEffect, useState } from 'react';
import type { PlatformRouter, PlatformSdk } from '@demo/platform-sdk';

export interface Platform {
  sdk: PlatformSdk;
  router: PlatformRouter;
  basePath: string;
}

export const PlatformContext = createContext<Platform | null>(null);

export function usePlatform(): Platform {
  const platform = useContext(PlatformContext);
  if (!platform) {
    throw new Error('PlatformContext is missing: render inside <react-app-element>.');
  }
  return platform;
}

export function useSdkEvent<T>(event: string, initial: T): T {
  const { sdk } = usePlatform();
  const [value, setValue] = useState<T>(initial);
  useEffect(() => sdk.subscribe(event, (payload) => setValue(payload as T)), [sdk, event]);
  return value;
}
