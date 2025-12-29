import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

import { FlagsDataServiceV1 } from '../../services/race-results-v1.service';
import { PredictionEditorComponent } from '../../components/prediction-editor/prediction-editor.component';
import { ResultEditorComponent } from '../../components/result-editor/result-editor.component';

@Component({
  selector: 'app-season-2025',
  imports: [
    CommonModule,
    FormsModule,
    PredictionEditorComponent,
    ResultEditorComponent,
    BrnDialogImports,
    HlmDialogImports,
    BrnSelectImports,
    HlmSelectImports,
  ],
  templateUrl: './season-2025.component.html',
  styleUrl: './season-2025.component.css',
})
export class Season2025Component {
  public raceDataService = inject(FlagsDataServiceV1);

  public selectedRaceId = signal<string>('0');
  public selectedYear = signal<string>('2025');
  public raceIds = signal<{ name: string; id: string }[]>([{ name: 'placeholder', id: '0' }]);

  public raceNumbers: string[] = [];
  public participants: string[] = [];
  public dataLoaded = false;

  constructor() {
    effect(() => {
      this.UpdateEditableData();
    });
  }

  UpdateEditableData() {
    let data = this.raceDataService.Datasets();
    let races = data[this.selectedYear()].results;
    let keys = Object.keys(races);
    let raceIds: { name: string; id: string }[] = [];
    for (let key of keys) {
      let race = races[+key];
      raceIds.push({ id: key, name: race.race || (+key + 1).toString() });
    }

    this.raceIds.set(raceIds);
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
    this.UpdateEditableData();

    const newRaceId = this.raceIds()[this.raceIds().length - 1];
    this.selectedRaceId.set(newRaceId.id);
  }
}
