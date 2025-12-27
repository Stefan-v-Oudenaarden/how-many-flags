import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'home', title: 'How Many Flags', component: HomeComponent },
  {
    path: '2025',
    title: '2025 Season',
    loadComponent: () =>
      import('./pages/season-2025/season-2025.component').then((m) => m.Season2025Component),
  },
  {
    path: '2026',
    title: '2026 Season',
    loadComponent: () =>
      import('./pages/season-2026/season-2026.component').then((m) => m.Season2026Component),
  },
  { path: '**', redirectTo: 'home' },
];
