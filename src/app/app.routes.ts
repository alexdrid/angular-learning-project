import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'learning',
        loadComponent: () => import('./pages/learning/learning').then((m) => m.Learning),
      },
    ],
  },
];
