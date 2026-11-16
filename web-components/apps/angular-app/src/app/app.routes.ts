import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { Settings } from './pages/settings';
import { Users } from './pages/users';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'users', component: Users },
  { path: 'settings', component: Settings },
];
