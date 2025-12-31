import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrnDialogImports, BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  FlagsDataServiceV1,
  RacePredictionsV1,
  RaceResultV1,
} from '../../services/race-results-v1.service';
import { PredictionEditorComponent } from '../../components/prediction-editor/prediction-editor.component';
import { ResultEditorComponent } from '../../components/result-editor/result-editor.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { AvatarService } from '../../services/avatar.service';
import { ScoreblockHeroV1Component } from '../../components/scoreblock-hero-v1/scoreblock-hero-v1.component';
import { ScoreblockV1Component } from '../../components/scoreblock-v1/scoreblock-v1.component';
import {
  racePredictionScores,
  ScoreV1Service,
  seasonPredictionScores,
  totalPredictionScores,
} from '../../services/score-v1.service';
import { RaceViewV1Component } from '../../components/race-view-v1/race-view-v1.component';
import { lucideChevronRight, lucideCircleCheckBig, lucideHourglass } from '@ng-icons/lucide';

@Component({
  selector: 'app-season-2025',
  imports: [
    CommonModule,
    FormsModule,
    PredictionEditorComponent,
    ResultEditorComponent,
    HlmCardImports,
    BrnDialogImports,
    HlmDialogImports,
    BrnSelectImports,
    HlmSelectImports,
    TopNavComponent,
    HlmTabsImports,
    HlmInputImports,
    ScoreblockHeroV1Component,
    ScoreblockV1Component,
    RaceViewV1Component,
    HlmIcon,
    NgIcon,
  ],
  providers: [provideIcons({ lucideCircleCheckBig, lucideHourglass })],
  templateUrl: './test-season.component.html',
  styleUrl: './test-season.component.css',
})
export class TestSeasonComponent {
  public raceDataService = inject(FlagsDataServiceV1);
  public avatars = inject(AvatarService);
  public scoreService = inject(ScoreV1Service);

  public selectedRaceId = signal<string>('0');
  public selectedYear = signal<string>('2025');
  public raceIds = signal<{ name: string; id: string }[]>([{ name: 'placeholder', id: '0' }]);
  public seasonScores = signal<seasonPredictionScores>({});
  public totalScores = signal<totalPredictionScores>({});
  public raceDisplayModalIsOpen = signal<BrnDialogState>('closed');

  public lastRaceScores = signal<racePredictionScores>({});
  public lastRaceResults = signal<RaceResultV1>({} as any);
  public lastRacePrediction = signal<RacePredictionsV1>({});
  public lastRaceParticipants = signal<string[]>([]);

  public displayedRaceScores = signal<racePredictionScores>({});
  public displayedRaceResults = signal<RaceResultV1>({} as any);
  public displayedRacePrediction = signal<RacePredictionsV1>({});
  public displayedRaceParticipants = signal<string[]>([]);

  public dataLoaded = false;

  constructor() {
    effect(() => {
      this.UpdateData();
    });
  }

  UpdateData() {
    let raceIds: { name: string; id: string }[] = [];

    const data = this.raceDataService.Datasets();
    const races = data[this.selectedYear()].results;
    const keys = Object.keys(races);
    let completedRaceKeys: number[] = [];

    for (let key of keys) {
      let race = races[+key];
      raceIds.push({ id: key, name: race.race || (+key + 1).toString() });

      if (race.finished) {
        completedRaceKeys.push(race.id);
      }
    }
    this.CalculateSeasonScores();

    const lastRaceId = completedRaceKeys[completedRaceKeys.length - 1];

    this.raceIds.set(raceIds);

    this.lastRacePrediction.set(data[this.selectedYear()].predictions[lastRaceId]);
    this.lastRaceParticipants.set(Object.keys(this.lastRacePrediction()));
    this.lastRaceResults.set(races[lastRaceId]);

    this.lastRaceScores.set(this.seasonScores()[lastRaceId]);
  }

  CalculateSeasonScores() {
    const data = this.raceDataService.Datasets();
    const races = data[this.selectedYear()].results;
    const racePredictions = data[this.selectedYear()].predictions;

    let scores = this.scoreService.CalculateSeasonScores(
      races,
      racePredictions,
      this.selectedYear()
    );

    this.seasonScores.set(scores.seasonScores);
    this.totalScores.set(scores.totalScores);
  }

  ExportSeasonData() {
    const seasonData = this.raceDataService.ExportYearData(this.selectedYear());

    // Create a Blob from the string
    const blob = new Blob([seasonData], { type: 'application/json' });

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json';

    // Trigger the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }

  AddRaceToSeason() {
    this.raceDataService.AddRaceToYear(this.selectedYear());
    this.UpdateData();

    const newRaceId = this.raceIds()[this.raceIds().length - 1];
    this.selectedRaceId.set(newRaceId.id);
  }

  listToHtmlString(items: string[]): string {
    if (items.length === 0) {
      return 'None';
    }

    return items.join(', ');
  }

  openRaceModalToRace(race: string) {
    if (!this.raceDataService.Datasets()[this.selectedYear()].results[+race].finished) {
      return;
    }

    this.displayedRaceResults.set(
      this.raceDataService.Datasets()[this.selectedYear()].results[+race]
    );

    this.displayedRaceScores.set(this.seasonScores()[race]);

    this.displayedRacePrediction.set(
      this.raceDataService.Datasets()[this.selectedYear()].predictions[+race]
    );

    this.displayedRaceParticipants.set(Object.keys(this.displayedRacePrediction()));

    this.raceDisplayModalIsOpen.set('open');
  }
}
