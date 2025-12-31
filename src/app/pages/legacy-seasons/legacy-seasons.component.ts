import { Component } from '@angular/core';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { LegacyScoreblockComponent } from '../../components/legacy-scoreblock/legacy-scoreblock.component';
import {
  leaderboardCategory2022,
  leaderboardCategory2023,
  leaderboardCategory2024,
  leaderboardCategory2025,
} from './legacy-data';
import { LegacySeasonPreviewComponent } from '../../components/legacy-season-preview/legacy-season-preview.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legacy-seasons',
  imports: [TopNavComponent, LegacySeasonPreviewComponent, RouterLink],
  templateUrl: './legacy-seasons.component.html',
  styleUrl: './legacy-seasons.component.css',
})
export class LegacySeasonsComponent {
  public season2025Scores = leaderboardCategory2025;
  public season2024Scores = leaderboardCategory2024;
  public season2023Scores = leaderboardCategory2023;
  public season2022Scores = leaderboardCategory2022;
}
