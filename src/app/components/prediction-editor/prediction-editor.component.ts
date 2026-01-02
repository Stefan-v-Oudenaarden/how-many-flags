import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

import { FlagsDataServiceV1, SeasonPredictionsV1 } from '../../services/race-results-v1.service';

@Component({
  selector: 'app-prediction-editor',
  imports: [CommonModule, FormsModule, BrnSelectImports, HlmSelectImports],

  templateUrl: './prediction-editor.component.html',
  styleUrl: './prediction-editor.component.css',
})
export class PredictionEditorComponent {
  public year = input.required<string>();
  public raceID = input.required<string>();

  public updatedData = output();

  raceData: SeasonPredictionsV1 = {};
  raceDataService = inject(FlagsDataServiceV1);

  participants: Set<string> = new Set();

  public newParticipantName: string = '';
  public dataLoaded = false;

  constructor() {
    effect(() => {
      let dataSet = this.raceDataService.Datasets()[this.year()];
      this.participants = new Set();

      if (Object.keys(dataSet).length > 0) {
        this.raceData = dataSet.predictions;

        if (
          !dataSet.predictions[this.raceID()] ||
          Object.keys(dataSet.predictions[this.raceID()]).length === 0
        ) {
          return;
        }

        const predictionParticpants = Object.keys(dataSet.predictions[this.raceID()]);
        for (const p of predictionParticpants) {
          this.participants.add(p);
        }

        this.dataLoaded = true;
      }
    });
  }

  onModelChange() {
    let dataSets = this.raceDataService.Datasets();
    dataSets[this.year()].predictions = this.raceData;
    this.raceDataService.Datasets.set(dataSets);

    this.updatedData.emit();
  }

  AddParticipant(name: string) {
    if (!name) {
      return;
    }

    this.raceDataService.AddParticipantToPredictions(this.year(), this.raceID(), name);
    this.participants.add(name);
    this.newParticipantName = '';
    this.updatedData.emit();
  }
}
