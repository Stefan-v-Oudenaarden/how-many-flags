import { inject, Injectable } from '@angular/core';
import {
  DataSetV1,
  FlagsDataServiceV1,
  SeasonPredictionsV1,
  SeasonResultV1,
} from './race-results-v1.service';

export type seasonPredictionScores = {
  [key: string]: racePredictionScores;
};

export type racePredictionScores = {
  [key: string]: predictionScores;
};

export type totalPredictionScores = {
  [key: string]: predictionScores;
};

export type predictionScores = {
  driverScore: number;
  flagScore: number;
  winnerScore: number;
  dnfScore: number;
  totalScore: number;
};

@Injectable({
  providedIn: 'root',
})
export class ScoreV1Service {
  public raceDataService = inject(FlagsDataServiceV1);

  CalculateSeasonScores(races: SeasonResultV1, racePredictions: SeasonPredictionsV1, year: string) {
    var seasonScores: seasonPredictionScores = {};
    var totalScores: totalPredictionScores = {};

    let participansSet: Set<string> = new Set();

    for (let prediction of Object.keys(racePredictions)) {
      let names = Object.keys(racePredictions[prediction]);
      for (let name of names) {
        participansSet.add(name);
      }
    }

    for (const p of participansSet) {
      totalScores[p] = {
        flagScore: 0,
        driverScore: 0,
        winnerScore: 0,
        dnfScore: 0,
        totalScore: 0,
      };
    }

    for (const race of races) {
      if (!race.finished) {
        continue;
      }

      const predictions = racePredictions[race.id];
      const racePredictionsScores: racePredictionScores = {};

      var participants = Object.keys(predictions);
      for (let participant of participants) {
        var prediction = predictions[participant];

        if (!prediction) {
          continue;
        }

        let flagScore = 0;
        let driverScore = 0;
        let dnfScore = 0;
        let winnerScore = 0;

        if (prediction.flags) {
          flagScore = this.CalculateFlagsScore(race.flags, prediction.flags);
        }

        if (prediction.drivers) {
          driverScore = this.CalculateDriversScore(race.drivers, prediction.drivers);
        }

        if (prediction.winner) {
          winnerScore = this.CalculateWinnerScore(race.id, race.winner, prediction.winner, year);
        }

        if (prediction.dnf) {
          dnfScore = this.CalculateDNFScore(race.id, race.dnfs, prediction.dnf, year);
        }

        let totalScore = flagScore + driverScore + dnfScore + winnerScore;

        racePredictionsScores[participant] = {
          flagScore,
          driverScore,
          dnfScore,
          winnerScore,
          totalScore,
        };

        totalScores[participant].flagScore += flagScore;
        totalScores[participant].driverScore += driverScore;
        totalScores[participant].dnfScore += dnfScore;
        totalScores[participant].winnerScore += winnerScore;
        totalScores[participant].totalScore += totalScore;
      }

      seasonScores[race.id] = racePredictionsScores;
    }

    return { seasonScores, totalScores };
  }

  CalculateFlagsScore(target: number, prediction: number): number {
    if (target === prediction) {
      return 3;
    }

    if (Math.abs(target - prediction) == 1) {
      return 1;
    }

    return 0;
  }

  CalculateDriversScore(target: number, prediction: number): number {
    if (target === prediction) {
      return 3;
    }

    if (Math.abs(target - prediction) == 1) {
      return 1;
    }

    return 0;
  }

  CalculateWinnerScore(id: number, target: string, prediction: string, year: string): number {
    if (target === prediction) {
      return 3;
    }

    var targetTeam = this.raceDataService.DriverToTeam(year, id, target);
    var predictionTeam = this.raceDataService.DriverToTeam(year, id, prediction);

    if (targetTeam === predictionTeam) {
      return 1;
    }

    return 0;
  }

  CalculateDNFScore(id: number, dnfs: string[], prediction: string, year: string): number {
    if (prediction === 'Nobody' && dnfs.length === 0) {
      return 3;
    }

    if (dnfs.indexOf(prediction) != -1) {
      return 3;
    }

    const dnfTeams = dnfs.map((driver) => this.raceDataService.DriverToTeam(year, id, driver));

    var predictionTeam = this.raceDataService.DriverToTeam(year, id, prediction);

    if (dnfTeams.indexOf(predictionTeam) != -1) {
      return 1;
    }

    return 0;
  }
}
