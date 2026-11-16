import { useEffect, useState } from 'react';
import { getPlatformSdk } from '@demo/platform-sdk';

export function useSdkEvent<T>(event: string, initial: T): T {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => getPlatformSdk().subscribe(event, (payload) => setValue(payload as T)), [event]);
  return value;
}
