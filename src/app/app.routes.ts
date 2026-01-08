import { Routes } from '@angular/router';

import { SeasonV1Component } from './pages/season-v1/season-v1.component';

export const routes: Routes = [
  { path: 'home', title: 'How Many Flags', component: SeasonV1Component },
  {
    path: 'test',
    title: 'Test Season',
    loadComponent: () =>
      import('./pages/season-v1/season-v1.component').then((m) => m.SeasonV1Component),
  },
  {
    path: 'season/:id',
    title: 'How Many Flags',
    loadComponent: () =>
      import('./pages/season-v1/season-v1.component').then((m) => m.SeasonV1Component),
  },
  {
    path: 'edit/:id',
    title: 'How Many Flags',
    loadComponent: () =>
      import('./pages/data-editor-v1/data-editor-v1.component').then(
        (m) => m.DataEditorV1Component
      ),
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
    title: 'Legacy Season 2025',
    loadComponent: () =>
      import('./pages/legacy-seasons/2025/LegacyStandings2025Component.component').then(
        (m) => m.LegacyStandings2025Component
      ),
  },
  { path: '**', redirectTo: 'home' },
];
