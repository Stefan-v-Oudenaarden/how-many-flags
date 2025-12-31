import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarService } from '../../../services/avatar.service';
import { LegacyScoreblockComponent } from '../../../components/legacy-scoreblock/legacy-scoreblock.component';
import { LegacyScoreblockHeroComponent } from '../../../components/legacy-scoreblock-hero/legacy-scoreblock-hero.component';
import { driversCategory2022, flagsCategory2022, leaderboardCategory2022 } from '../legacy-data';
import { TopNavComponent } from '../../../components/top-nav/top-nav.component';

@Component({
  selector: 'app-legacy-standings-2022',
  imports: [
    CommonModule,
    LegacyScoreblockComponent,
    LegacyScoreblockHeroComponent,
    TopNavComponent,
  ],
  templateUrl: './LegacyStandings2022Component.component.html',
  styleUrl: './LegacyStandings2022Component.component.css',
})
export class LegacyStandings2022Component {
  public avatars = inject(AvatarService);

  public leaderboardCategory = leaderboardCategory2022;
  public flagsCategory = flagsCategory2022;
  public driversCategory = driversCategory2022;
}
