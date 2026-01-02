import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type DriverV1 = {
  name: string;
  team: string;
};

export type DriversTableV1 = DriverV1[];

export type DriverTableOverrideV1 = {
  ids: number[];
  driver: string;
  team: string;
};

export type DriversTableOverridesV1 = DriverTableOverrideV1[];

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
  driverOverrides: DriversTableOverridesV1;
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

  public Datasets = signal<DataSetsV1>({});
  public DataLoaded = computed(() => {
    return this.DatasetsLoaded() === 6;
  });
  private DatasetsLoaded = signal<number>(0);

  constructor() {
    this.Datasets.set({
      '2025': {
        predictions: {},
        results: [],
        driversWithTeams: [],
        drivers: [],
        teams: [],
        driverOverrides: [],
      },
      '2026': {
        predictions: {},
        results: [],
        driversWithTeams: [],
        drivers: [],
        teams: [],
        driverOverrides: [],
      },
    });

    this.http.get<YearDataV1>('/data/2025/data.json').subscribe((data) => {
      this.LoadYearData('2025', data);
      this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
    });

    this.http.get<DriversTableV1>('/data/2025/drivers.json').subscribe((driversWithTeams) => {
      this.LoadDriversTable('2025', driversWithTeams);
      this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
    });

    this.http
      .get<DriversTableOverridesV1>('/data/2025/driver-overrides.json')
      .subscribe((overrides) => {
        this.LoadDriversTableOverrides('2025', overrides);
        this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
      });

    this.http.get<YearDataV1>('/data/2026/data.json').subscribe((data) => {
      this.LoadYearData('2026', data);
      this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
    });

    this.http.get<DriversTableV1>('/data/2026/drivers.json').subscribe((driversWithTeams) => {
      this.LoadDriversTable('2026', driversWithTeams);
      this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
    });
    this.http
      .get<DriversTableOverridesV1>('/data/2026/driver-overrides.json')
      .subscribe((overrides) => {
        this.LoadDriversTableOverrides('2026', overrides);
        this.DatasetsLoaded.set(this.DatasetsLoaded() + 1);
      });
  }

  LoadYearData(year: string, data: YearDataV1) {
    let datasets = this.Datasets();
    datasets[year].predictions = data.predictions;
    datasets[year].results = data.results;

    this.Datasets.set(datasets);
  }

  LoadDriversTable(year: string, driversWithTeams: DriversTableV1) {
    let datasets = this.Datasets();
    datasets[year].driversWithTeams = driversWithTeams;

    let drivers = new Set<string>();
    let teams = new Set<string>();

    for (let pair of driversWithTeams) {
      drivers.add(pair.name);
      teams.add(pair.team);
    }

    let sortedDrivers = [...drivers].sort();
    sortedDrivers.push('Nobody');

    datasets[year].drivers = sortedDrivers;
    datasets[year].teams = [...teams].sort();

    this.Datasets.set({ ...datasets });
  }

  LoadDriversTableOverrides(year: string, overrides: DriversTableOverridesV1) {
    let datasets = this.Datasets();
    datasets[year].driverOverrides = overrides;
    this.Datasets.set({ ...datasets });
  }

  DriverToTeam(year: string, id: number, driver: string): string {
    let override = this.Datasets()[year].driverOverrides.find((or) => {
      return or.ids.includes(id) && or.driver === driver;
    });

    if (override) {
      return override.team;
    }

    return (
      this.Datasets()[year].driversWithTeams.find((pair) => pair.name == driver)?.team || 'unknown'
    );
  }

  TeamToDrivers(year: string, team: string): string[] {
    return this.Datasets()
      [year].driversWithTeams.filter((pair) => pair.team == team)
      .map((e) => e.name);
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

    participansSet.add('Pidgeons');

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

    this.Datasets.set({ ...this.Datasets() });
  }

  AddParticipantToPredictions(year: string, race: string, name: string) {
    let dataSets = this.Datasets();
    let racePredictions = dataSets[year].predictions[race];
    racePredictions[name] = {
      dnf: '',
      winner: '',
    };

    this.Datasets.set({ ...dataSets });
  }

  ExportYearData(year: string): string {
    const data: YearDataV1 = {
      predictions: this.Datasets()[year].predictions,
      results: this.Datasets()[year].results,
    };

    console.info('export', data);

    return JSON.stringify(data, null, 2);
  }
}
