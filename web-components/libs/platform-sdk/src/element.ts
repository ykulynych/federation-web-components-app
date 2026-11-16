import type { PlatformRouter } from './router';
import type { PlatformSdk } from './types';

/**
 * Contract every remote custom element implements. The shell sets the two properties
 * BEFORE attaching the element to the DOM.
 *
 * Attributes: `base-path` (URL prefix owned by the shell) and `shadow` ("open" | "none").
 */
export interface PlatformElement extends HTMLElement {
  platformSdk: PlatformSdk;
  router: PlatformRouter;
}

export type ShadowMode = 'open' | 'none';
