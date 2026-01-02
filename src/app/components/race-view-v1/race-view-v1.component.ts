import { Component, computed, input } from '@angular/core';
import { racePredictionScores } from '../../services/score-v1.service';
import { RacePredictionsV1, RaceResultV1 } from '../../services/race-results-v1.service';
import { ScoreblockV1Component } from '../scoreblock-v1/scoreblock-v1.component';
import { isEmpty } from 'rxjs';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-race-view-v1',
  imports: [ScoreblockV1Component, HlmEmptyImports, HlmIcon, NgIcon, HlmEmptyImports],
  providers: [provideIcons({ lucideAlertTriangle })],
  templateUrl: './race-view-v1.component.html',
  styleUrl: './race-view-v1.component.css',
})
export class RaceViewV1Component {
  public scores = input.required<racePredictionScores>();
  public results = input.required<RaceResultV1>();
  public predictions = input.required<RacePredictionsV1>();
  public participants = input.required<string[]>();
  public displaySize = input<'small' | 'large'>('large');

  isEmpty(object: any): boolean {
    return Object.keys(object).length === 0;

    return false;
  }

  listToHtmlString(items: string[]): string {
    if (!items || items.length === 0) {
      return 'None';
    }

    return items.join(', ');
  }
}
