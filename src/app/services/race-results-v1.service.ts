import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type SeasonResultV1 = RaceResultV1[];
export type RaceResultV1 = {
  race: string;
  id: number;
  flags: number;
  drivers: number;
  winner: string;
  team: string;
  dnfs: string[];
};

export type RaceResultPredictionV1 = {
  flags?: number;
  drivers?: number;
  winner?: string;
  dnf?: string;
};

export interface RacePredictionsV1 {
  [key: string]: RaceResultPredictionV1;
}

export interface SeasonPredictionsV1 {
  [key: string]: RacePredictionsV1;
}

export interface DataSetV1 {
  predictions: SeasonPredictionsV1;
  results: SeasonResultV1;
}

export interface DataSetsV1 {
  [key: string]: DataSetV1;
}

@Injectable({
  providedIn: 'root',
})
export class FlagsDataServiceV1 {
  private http = inject(HttpClient);

  public years: string[] = ['2025'];

  // Season2025RaceResults = signal<SeasonResultV1>([]);
  // Season2025RacePredictions = signal<SeasonPredictionsV1>({});

  Datasets = signal<DataSetsV1>({});

  constructor() {
    this.Datasets.set({ '2025': { predictions: {}, results: [] } });

    this.http.get<SeasonPredictionsV1>('/data/2025/predictions.json').subscribe((predictions) => {
      let datasets = this.Datasets();
      datasets['2025'].predictions = predictions;
      this.Datasets.set(datasets);
    });

    this.http.get<SeasonResultV1>('/data/2025/results.json').subscribe((result) => {
      let datasets = this.Datasets();
      datasets['2025'].results = result;
      this.Datasets.set(datasets);
    });
  }
}
