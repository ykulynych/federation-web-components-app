import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { Dashboard } from './pages/dashboard';
import { RemoteHost } from './pages/remote-host';

/** Matches /<prefix> and everything below it; the remote owns the sub-routes. */
function prefix(name: string) {
  return (segments: UrlSegment[]): UrlMatchResult | null => (segments[0]?.path === name ? { consumed: segments } : null);
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Dashboard },
  { matcher: prefix('angular-app'), component: RemoteHost, data: { remote: 'angular-app' } },
  { matcher: prefix('react-app'), component: RemoteHost, data: { remote: 'react-app' } },
  { path: '**', redirectTo: '' },
];
