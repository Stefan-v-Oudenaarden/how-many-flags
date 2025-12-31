import { Component, computed, inject, input } from '@angular/core';

import { AvatarService } from '../../services/avatar.service';
import { totalPredictionScores } from '../../services/score-v1.service';

@Component({
  selector: 'app-scoreblock-v1',
  imports: [],
  templateUrl: './scoreblock-v1.component.html',
  styleUrl: './scoreblock-v1.component.css',
})
export class ScoreblockV1Component {
  public scores = input.required<totalPredictionScores>();
  public selectedScore = input.required<
    'driverScore' | 'flagScore' | 'winnerScore' | 'dnfScore' | 'totalScore'
  >();

  public scoreLines = computed(() => {
    let scoreLines = [];

    for (let name of Object.keys(this.scores())) {
      let scoreType = this.scores()[name];
      let scoreIndex = this.selectedScore() as keyof typeof scoreType;
      scoreLines.push({ name: name, score: this.scores()[name][scoreIndex], place: 0 });
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

  public displayAwards = input<boolean>(false);
  public displayName = input<string>('');
  public displayIcon = input<string>('/icons/trophy-sharp.svg');
  public displayIconStyle = input<string>('bg-linear-to-r from-yellow-400 to-orange-500');

  public avatars = inject(AvatarService);
}
