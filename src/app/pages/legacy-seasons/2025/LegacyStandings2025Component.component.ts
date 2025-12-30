import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarService } from '../../../services/avatar.service';
import { LegacyScoreblockComponent } from '../../../components/legacy-scoreblock/legacy-scoreblock.component';
import { LegacyScoreblockHeroComponent } from '../../../components/legacy-scoreblock-hero/legacy-scoreblock-hero.component';
import {
  dnfCategory2025,
  driversCategory2025,
  flagsCategory2025,
  leaderboardCategory2025,
  winnerCategory2025,
} from './legacy-data';

@Component({
  selector: 'app-legacy-standings-2024',
  imports: [CommonModule, LegacyScoreblockComponent, LegacyScoreblockHeroComponent],
  templateUrl: './LegacyStandings2025Component.component.html',
  styleUrl: './LegacyStandings2025Component.component.css',
})
export class LegacyStandings2025Component {
  public avatars = inject(AvatarService);

  public leaderboardCategory = leaderboardCategory2025;

  public flagsCategory = flagsCategory2025;
  public driversCategory = driversCategory2025;
  public winnerCategory = winnerCategory2025;
  public dnfCategory = dnfCategory2025;
}
