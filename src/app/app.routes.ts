import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestSeasonComponent } from './pages/test/test-season.component';

export const routes: Routes = [
  { path: 'home', title: 'How Many Flags', component: TestSeasonComponent },
  {
    path: 'test',
    title: 'Test Season',
    loadComponent: () =>
      import('./pages/test/test-season.component').then((m) => m.TestSeasonComponent),
  },
  {
    path: '2026',
    title: '2026 Season',
    loadComponent: () =>
      import('./pages/season-2026/season-2026.component').then((m) => m.Season2026Component),
  },
  {
    path: 'legacy',
    title: 'Legacy Seasons',
    loadComponent: () =>
      import('./pages/legacy-seasons/legacy-seasons.component').then(
        (m) => m.LegacySeasonsComponent
      ),
  },
  {
    path: 'legacy/2022',
    title: 'Legacy Season 2022',
    loadComponent: () =>
      import('./pages/legacy-seasons/2022/LegacyStandings2022Component.component').then(
        (m) => m.LegacyStandings2022Component
      ),
  },
  {
    path: 'legacy/2023',
    title: 'Legacy Season 2023',
    loadComponent: () =>
      import('./pages/legacy-seasons/2023/LegacyStandings2023Component.component').then(
        (m) => m.LegacyStandings2023Component
      ),
  },
  {
    path: 'legacy/2024',
    title: 'Legacy Season 2024',
    loadComponent: () =>
      import('./pages/legacy-seasons/2024/LegacyStandings2024Component.component').then(
        (m) => m.LegacyStandings2024Component
      ),
  },
  {
    path: 'legacy/2025',
    title: 'Legacy Season 22025',
    loadComponent: () =>
      import('./pages/legacy-seasons/2025/LegacyStandings2025Component.component').then(
        (m) => m.LegacyStandings2025Component
      ),
  },
  { path: '**', redirectTo: 'home' },
];
