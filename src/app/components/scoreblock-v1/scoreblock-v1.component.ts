import { Component, computed, inject, input } from '@angular/core';

import { AvatarService } from '../../services/avatar.service';
import { racePredictionScores, totalPredictionScores } from '../../services/score-v1.service';
import { scoreLine } from '../scoreblock-hero-v1/scoreblock-hero-v1.component';

@Component({
  selector: 'app-scoreblock-v1',
  imports: [],
  templateUrl: './scoreblock-v1.component.html',
  styleUrl: './scoreblock-v1.component.css',
})
export class ScoreblockV1Component {
  public scores = input.required<totalPredictionScores>();
  public lastRaceScores = input<racePredictionScores>();

  public displayTop = input<boolean>(true);
  public displayAwards = input<boolean>(false);
  public displayName = input<string>('');
  public displayIcon = input<string>('/icons/trophy-sharp.svg');
  public displayIconStyle = input<string>('bg-linear-to-r from-yellow-400 to-orange-500');
  public displaySize = input<'small' | 'large'>('large');

  public selectedScore = input.required<
    'driverScore' | 'flagScore' | 'winnerScore' | 'dnfScore' | 'totalScore'
  >();

  public scoreLines = computed(() => {
    let scoreLines: scoreLine[] = [];
    let lastRaceScores = this.lastRaceScores();

    for (let name of Object.keys(this.scores())) {
      let diff: number | undefined = undefined;

      if (lastRaceScores) {
        let lastScoreType = lastRaceScores[name];
        let lastScoreIndex = this.selectedScore() as keyof typeof lastScoreType;

        diff = lastRaceScores[name][lastScoreIndex];
      }

      let scoreType = this.scores()[name];
      let scoreIndex = this.selectedScore() as keyof typeof scoreType;

      scoreLines.push({
        name: name,
        score: this.scores()[name][scoreIndex],
        difference: diff,
      });
    }

    scoreLines.sort((a, b) => {
      return b.score - a.score;
    });

    for (const line of scoreLines) {
      if (line.score === scoreLines[0].score) {
        line.place = 1;
      }
    }

    return scoreLines;
  });

  public avatars = inject(AvatarService);
}
