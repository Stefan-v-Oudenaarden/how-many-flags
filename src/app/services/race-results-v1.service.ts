import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type DriverV1 = {
  name: string;
  team: string;
};

export type DriversTableV1 = DriverV1[];

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
  driversWithTeams: DriversTableV1;
  drivers: string[];
  teams: string[];
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

  Datasets = signal<DataSetsV1>({});

  constructor() {
    this.Datasets.set({
      '2025': { predictions: {}, results: [], driversWithTeams: [], drivers: [], teams: [] },
    });

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

    this.http.get<DriversTableV1>('/data/2025/drivers.json').subscribe((driversWithTeams) => {
      let datasets = this.Datasets();
      datasets['2025'].driversWithTeams = driversWithTeams;

      let drivers = new Set<string>();
      let teams = new Set<string>();

      for (let pair of driversWithTeams) {
        drivers.add(pair.name);
        teams.add(pair.team);
      }

      drivers.add('Nobody');

      datasets['2025'].drivers = [...drivers];
      datasets['2025'].teams = [...teams];

      this.Datasets.set(datasets);
    });
  }

  DriverToTeam(year: string, driver: string): string {
    return (
      this.Datasets()[year].driversWithTeams.find((pair) => pair.name == driver)?.team || 'unknown'
    );
  }

  TeamToDriver(year: string, team: string): string {
    return (
      this.Datasets()[year].driversWithTeams.find((pair) => pair.team == team)?.name || 'unknown'
    );
  }
}
