import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarService } from '../../../services/avatar.service';
import { LegacyScoreblockComponent } from '../../../components/legacy-scoreblock/legacy-scoreblock.component';
import { LegacyScoreblockHeroComponent } from '../../../components/legacy-scoreblock-hero/legacy-scoreblock-hero.component';
import {
  dnfCategory2024,
  driversCategory2024,
  flagsCategory2024,
  leaderboardCategory2024,
  winnerCategory2024,
} from '../legacy-data';
import { TopNavComponent } from '../../../components/top-nav/top-nav.component';

@Component({
  selector: 'app-legacy-standings-2024',
  imports: [
    CommonModule,
    LegacyScoreblockComponent,
    LegacyScoreblockHeroComponent,
    TopNavComponent,
  ],
  templateUrl: './LegacyStandings2024Component.component.html',
  styleUrl: './LegacyStandings2024Component.component.css',
})
export class LegacyStandings2024Component {
  public avatars = inject(AvatarService);

  public leaderboardCategory = leaderboardCategory2024;

  public flagsCategory = flagsCategory2024;

  public driversCategory = driversCategory2024;

  public winnerCategory = winnerCategory2024;

  public dnfCategory = dnfCategory2024;
}
