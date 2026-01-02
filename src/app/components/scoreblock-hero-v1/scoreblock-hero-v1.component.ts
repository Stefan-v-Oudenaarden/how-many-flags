import { Component, computed, inject, input } from '@angular/core';

import { AvatarService } from '../../services/avatar.service';
import { racePredictionScores, totalPredictionScores } from '../../services/score-v1.service';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { lucideAlertTriangle } from '@ng-icons/lucide';

export type scoreLine = {
  name: string;
  score: number;
  place?: number;
  difference?: number;
};

@Component({
  selector: 'app-scoreblock-hero-v1',
  imports: [HlmIcon, NgIcon, HlmEmptyImports],
  providers: [provideIcons({ lucideAlertTriangle })],
  templateUrl: './scoreblock-hero-v1.component.html',
  styleUrl: './scoreblock-hero-v1.component.css',
})
export class ScoreblockHeroV1Component {
  public scores = input.required<totalPredictionScores>();
  public lastRaceScores = input<racePredictionScores>();
  public selectedScore = input.required<
    'driverScore' | 'flagScore' | 'winnerScore' | 'dnfScore' | 'totalScore'
  >();

  public scoreLines = computed(() => {
    let scoreLines: scoreLine[] = [];
    let lastRaceScores = this.lastRaceScores();

    for (let name of Object.keys(this.scores())) {
      let scoreType = this.scores()[name];
      let scoreIndex = this.selectedScore() as keyof typeof scoreType;

      let diff: number | undefined = undefined;

      if (lastRaceScores) {
        let lastScoreType = lastRaceScores[name];
        let lastScoreIndex = this.selectedScore() as keyof typeof lastScoreType;

        if (lastRaceScores[name] && lastRaceScores[name][lastScoreIndex]) {
          diff = lastRaceScores[name][lastScoreIndex];
        }
      }

      scoreLines.push({
        name: name,
        score: this.scores()[name][scoreIndex],
        difference: diff,
      });
    }

    scoreLines.sort((a, b) => {
      return b.score - a.score;
    });

    const topThreeScores = [...new Set(scoreLines.map((e) => e.score))].slice(0, 3);

    for (const line of scoreLines) {
      line.place = topThreeScores.indexOf(line.score) + 1;
    }

    return scoreLines;
  });

  public displayAwards = input<boolean>(false);
  public displayName = input<string>('');
  public displayIcon = input<string>('/icons/trophy-sharp.svg');
  public displayIconStyle = input<string>('bg-linear-to-r from-yellow-400 to-orange-500');

  public avatars = inject(AvatarService);

  placeBackground(place?: number) {
    switch (place) {
      case 1:
        return 'bg-linear-to-r from-yellow-100 to-orange-100 shadow-md hover:shadow-lg';
      case 2:
        return 'bg-linear-to-r from-yellow-50 to-orange-100 shadow-md hover:shadow-lg';
      case 3:
        return 'bg-linear-to-r from-yellow-50 to-orange-50 shadow-md hover:shadow-lg';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  }
}
