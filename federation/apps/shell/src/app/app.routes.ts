import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Dashboard } from './pages/dashboard';
import { ReactHost, reactMatcher } from './pages/react-host';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Dashboard },
  {
    path: 'angular-app',
    loadChildren: () =>
      loadRemoteModule<{ ANGULAR_APP_ROUTES: Routes }>('angular-app', './routes').then(
        (m) => m.ANGULAR_APP_ROUTES,
      ),
  },
  { matcher: reactMatcher, component: ReactHost },
  { path: '**', redirectTo: '' },
];
