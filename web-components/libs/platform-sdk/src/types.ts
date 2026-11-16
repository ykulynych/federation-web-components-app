export interface User {
  id: string;
  name: string;
}

export type Theme = 'light' | 'dark';

export type FeatureFlags = Record<string, boolean>;

export type Unsubscribe = () => void;

export interface PlatformSdk {
  getCurrentUser(): User;
  showNotification(message: string): void;
  navigate(url: string): void;

  publish(event: string, payload: unknown): void;
  subscribe(event: string, handler: (payload: unknown) => void): Unsubscribe;

  // Shell -> app context. Theme changes are announced on THEME_CHANGED_EVENT.
  getTheme(): Theme;
  getFeatureFlags(): FeatureFlags;
}

export const CUSTOMER_SELECTED_EVENT = 'customer-selected';
export const THEME_CHANGED_EVENT = 'platform:theme-changed';

export interface Customer {
  id: string;
  name: string;
}
