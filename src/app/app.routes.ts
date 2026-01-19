import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'heroes',
    loadComponent: () => import('./pages/heroes-page/heroes-page').then((m) => m.HeroesPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/user-register/user-register').then((m) => m.UserRegister),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/hero-detail/hero-detail').then((m) => m.HeroDetail),
  },
];
