import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarService } from '../../../services/avatar.service';
import { LegacyScoreblockComponent } from '../../../components/legacy-scoreblock/legacy-scoreblock.component';
import { LegacyScoreblockHeroComponent } from '../../../components/legacy-scoreblock-hero/legacy-scoreblock-hero.component';
import {
  driversCategory2023,
  flagsCategory2023,
  lastCategory2023,
  leaderboardCategory2023,
  winnerCategory2023,
} from '../2025/legacy-data';

@Component({
  selector: 'app-legacy-standings-2023',
  imports: [CommonModule, LegacyScoreblockComponent, LegacyScoreblockHeroComponent],
  templateUrl: './LegacyStandings2023Component.component.html',
  styleUrl: './LegacyStandings2023Component.component.css',
})
export class LegacyStandings2023Component {
  public avatars = inject(AvatarService);

  public leaderboardCategory = leaderboardCategory2023;
  public flagsCategory = flagsCategory2023;
  public driversCategory = driversCategory2023;
  public winnerCategory = winnerCategory2023;
  public lastCategory = lastCategory2023;
}
