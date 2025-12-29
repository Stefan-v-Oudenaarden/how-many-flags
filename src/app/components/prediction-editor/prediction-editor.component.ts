import { Component, effect, inject, input } from '@angular/core';
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

  raceData: SeasonPredictionsV1 = {};
  raceDataService = inject(FlagsDataServiceV1);

  participants: Set<string> = new Set();
  public dataLoaded = false;

  constructor() {
    effect(() => {
      let dataSet = this.raceDataService.Datasets()[this.year()];
      if (Object.keys(dataSet).length > 0) {
        this.raceData = dataSet.predictions;
        this.participants = new Set();

        for (let prediction of Object.keys(dataSet.predictions)) {
          let names = Object.keys(dataSet.predictions[prediction]);
          for (let name of names) {
            this.participants.add(name);
          }
        }

        this.dataLoaded = true;
      }
    });
  }

  onModelChange() {
    let dataSets = this.raceDataService.Datasets();
    dataSets[this.year()].predictions = this.raceData;
    this.raceDataService.Datasets.set(dataSets);
  }
}
