import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { RemoteLayout } from './pages/remote-layout';
import { Settings } from './pages/settings';
import { Users } from './pages/users';

/** Mounted by the shell under /angular-app. */
export const ANGULAR_APP_ROUTES: Routes = [
  {
    path: '',
    component: RemoteLayout,
    children: [
      { path: '', pathMatch: 'full', component: Home },
      { path: 'users', component: Users },
      { path: 'settings', component: Settings },
    ],
  },
];
