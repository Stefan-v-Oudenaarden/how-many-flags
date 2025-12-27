import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FlagsDataServiceV1,
  RaceResultV1,
  SeasonResultV1,
} from '../../services/race-results-v1.service';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';

@Component({
  selector: 'app-result-editor',
  imports: [CommonModule, FormsModule, BrnSelectImports, HlmSelectImports, HlmScrollAreaImports],
  templateUrl: './result-editor.component.html',
  styleUrl: './result-editor.component.css',
})
export class ResultEditorComponent {
  public year = input.required<string>();
  public raceID = input.required<string>();

  raceData: RaceResultV1 | undefined = undefined;
  raceDataService = inject(FlagsDataServiceV1);

  public dataLoaded = false;

  constructor() {
    effect(() => {
      let dataSet = this.raceDataService.Datasets()[this.year()].results;

      if (Object.keys(dataSet).length > 0) {
        this.raceData = dataSet.find((set) => {
          return set.id == +this.raceID();
        });

        this.dataLoaded = true;
      }
    });
  }

  onModelChange() {
    let dataSets = this.raceDataService.Datasets();
    let dataSet = dataSets[this.year()].results.find((set) => {
      return set.id == +this.raceID();
    });

    if (dataSet && this.raceData) {
      dataSet.id = this.raceData.id;
      dataSet.race = this.raceData.race;

      dataSet.flags = this.raceData.flags;
      dataSet.drivers = this.raceData.drivers;
      dataSet.winner = this.raceData.winner;
      dataSet.team = this.raceData.team;
      dataSet.dnfs = this.raceData.dnfs;
    }

    this.raceDataService.Datasets.set(dataSets);
    console.log('+', dataSets);
  }
}
