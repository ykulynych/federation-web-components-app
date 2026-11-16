import type { Unsubscribe } from './types';

/** The routing contract between the shell and every web component. */
export interface PlatformRouter {
  /** Full app URL as owned by the shell, e.g. "/react-app/details/123". */
  currentPath(): string;
  navigate(url: string): void;
  subscribe(handler: (url: string) => void): Unsubscribe;
}
