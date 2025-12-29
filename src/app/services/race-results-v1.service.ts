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
  finished: boolean;
  notes: string;
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

type YearDataV1 = {
  predictions: SeasonPredictionsV1;
  results: SeasonResultV1;
};

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

    this.http.get<YearDataV1>('/data/2025/data.json').subscribe((data) => {
      let datasets = this.Datasets();
      datasets['2025'].predictions = data.predictions;
      datasets['2025'].results = data.results;
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

      let sortedDrivers = [...drivers].sort();
      sortedDrivers.push('Nobody');

      datasets['2025'].drivers = sortedDrivers;
      datasets['2025'].teams = [...teams].sort();

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

  AddRaceToYear(year: string) {
    const data = this.Datasets()[year];
    let raceId = data.results.length;

    let raceResult: RaceResultV1 = {
      race: 'Unknown',
      id: raceId,
      flags: 0,
      drivers: 20,
      winner: 'Placeholder',
      team: 'Placeholder Team',
      dnfs: [],
      finished: false,
      notes: '',
    };

    let participansSet: Set<string> = new Set();

    for (let prediction of Object.keys(data.predictions)) {
      let names = Object.keys(data.predictions[prediction]);
      for (let name of names) {
        participansSet.add(name);
      }
    }

    let predictions: RacePredictionsV1 = {};

    for (const p of participansSet) {
      predictions[p] = {
        flags: 0,
        drivers: 0,
        dnf: '',
        winner: '',
      };
    }

    data.results.push(raceResult);
    data.predictions[raceId.toString()] = predictions;

    this.Datasets.set(this.Datasets());
  }

  AddParticipantToPredictions(year: string, race: string, name: string) {
    let dataSets = this.Datasets();
    let racePredictions = dataSets[year].predictions[race];
    racePredictions[name] = {
      dnf: '',
      winner: '',
    };

    this.Datasets.set(dataSets);

    console.log(this.Datasets());
  }

  ExportYearData(year: string): string {
    const data: YearDataV1 = {
      predictions: this.Datasets()[year].predictions,
      results: this.Datasets()[year].results,
    };

    console.log('export', data);

    return JSON.stringify(data, null, 2);
  }
}
