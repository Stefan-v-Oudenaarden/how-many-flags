import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  lucideAlertTriangle,
  lucideCircleCheckBig,
  lucideHourglass,
  lucidePencilRuler,
  lucidePlusCircle,
} from '@ng-icons/lucide';
import { DialogService } from '@ngneat/dialog';
import { BrnDialogImports, BrnDialogState } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

import { DataEditorV1Component } from '../../components/data-editor-v1/data-editor-v1.component';
import { RaceViewV1Component } from '../../components/race-view-v1/race-view-v1.component';
import { ScoreblockHeroV1Component } from '../../components/scoreblock-hero-v1/scoreblock-hero-v1.component';
import { ScoreblockV1Component } from '../../components/scoreblock-v1/scoreblock-v1.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { AvatarService } from '../../services/avatar.service';
import {
  DataSetsV1,
  FlagsDataServiceV1,
  RacePredictionsV1,
  RaceResultV1,
} from '../../services/race-results-v1.service';
import {
  racePredictionScores,
  ScoreV1Service,
  seasonPredictionScores,
  totalPredictionScores,
} from '../../services/score-v1.service';

@Component({
  selector: 'app-season-2025',
  imports: [
    CommonModule,
    FormsModule,
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
    HlmEmptyImports,
    HlmSkeletonImports,
  ],
  providers: [
    provideIcons({
      lucidePencilRuler,
      lucideCircleCheckBig,
      lucideHourglass,
      lucideAlertTriangle,
      lucidePlusCircle,
    }),
  ],
  templateUrl: './test-season.component.html',
  styleUrl: './test-season.component.css',
})
export class TestSeasonComponent {
  public raceDataService = inject(FlagsDataServiceV1);
  public avatars = inject(AvatarService);
  public scoreService = inject(ScoreV1Service);
  private dialogService = inject(DialogService);

  public selectedRaceId = signal<string>('0');
  public selectedYear = signal<string>('2025');
  public raceIds = signal<{ name: string; id: string }[]>([]);
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

  ngOnInit() {
    this.UpdateData(this.raceDataService.Datasets());
  }

  UpdateData(data: DataSetsV1) {
    let raceIds: { name: string; id: string }[] = [];

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

    if (
      Object.keys(data[this.selectedYear()].results).length === 0 ||
      Object.keys(data[this.selectedYear()].predictions).length === 0
    ) {
      //No data to work with.
      return;
    }

    this.CalculateSeasonScores();
    this.raceIds.set(raceIds);

    if (completedRaceKeys.length === 0) {
      return;
    }

    const lastRaceId = completedRaceKeys[completedRaceKeys.length - 1];

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

  listToHtmlString(items: string[]): string {
    if (items.length === 0) {
      return 'None';
    }

    return items.join(', ');
  }

  openDataEditModal() {
    const editModalReference = this.dialogService.open(DataEditorV1Component, {
      width: '80vw',
      height: '90vh',
      data: {
        updateCallBack: () => {
          this.UpdateData(this.raceDataService.Datasets());
        },
      },
    });
    editModalReference.afterClosed$.subscribe(() => {
      this.UpdateData(this.raceDataService.Datasets());
    });
  }

  openRaceModalToRace(race: string, tpl: TemplateRef<any>) {
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
    this.dialogService.open(tpl, {
      width: '80vw',
      height: '85vh',
    });
  }
}
