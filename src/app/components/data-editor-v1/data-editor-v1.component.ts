import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlertTriangle,
  lucideCircleCheckBig,
  lucideHourglass,
  lucidePlusCircle,
} from '@ng-icons/lucide';
import { DialogRef } from '@ngneat/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

import { PredictionEditorComponent } from '../../components/prediction-editor/prediction-editor.component';
import { ResultEditorComponent } from '../../components/result-editor/result-editor.component';
import { AvatarService } from '../../services/avatar.service';
import { DataSetsV1, FlagsDataServiceV1 } from '../../services/race-results-v1.service';
import { ScoreV1Service } from '../../services/score-v1.service';

interface Data {
  updateCallBack: () => void;
}

@Component({
  selector: 'app-data-editor-v1',
  providers: [
    provideIcons({ lucideCircleCheckBig, lucideHourglass, lucideAlertTriangle, lucidePlusCircle }),
  ],
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
    HlmTabsImports,
    HlmInputImports,
    HlmIcon,
    NgIcon,
    HlmEmptyImports,
    HlmSkeletonImports,
  ],
  templateUrl: './data-editor-v1.component.html',
  styleUrl: './data-editor-v1.component.css',
})
export class DataEditorV1Component {
  public raceDataService = inject(FlagsDataServiceV1);
  public avatars = inject(AvatarService);
  public scoreService = inject(ScoreV1Service);
  private modalRef: DialogRef<Data, boolean> = inject(DialogRef);

  public selectedYear = input<string>('2025');
  public selectedRaceId = signal<string>('0');

  public raceIds = signal<{ name: string; id: string }[]>([]);

  public dataLoaded = false;

  constructor() {
    effect(() => {
      const data = this.raceDataService.Datasets();
      this.UpdateData(data);
    });
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

    this.raceIds.set(raceIds);
    this.modalRef.data.updateCallBack();
  }

  AddRaceToSeason() {
    this.raceDataService.AddRaceToYear(this.selectedYear());

    this.UpdateData(this.raceDataService.Datasets());

    const newRaceId = this.raceIds()[this.raceIds().length - 1] || 0;
    this.selectedRaceId.set(newRaceId.id);
  }

  ExportSeasonData() {
    const seasonData = this.raceDataService.ExportYearData(this.selectedYear());

    const blob = new Blob([seasonData], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json';

    link.click();

    URL.revokeObjectURL(link.href);
  }
}
