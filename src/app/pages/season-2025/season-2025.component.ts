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

type seasonPredictionScores = {
  [key: string]: racePredictionScores;
};

type racePredictionScores = {
  [key: string]: predictionScores;
};

type totalPredictionScores = {
  [key: string]: predictionScores;
};

type predictionScores = {
  driverScore: number;
  flagScore: number;
  winnerScore: number;
  dnfScore: number;
  totalScore: number;
};

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

  public dataLoaded = false;

  constructor() {
    effect(() => {
      this.UpdateData();
    });
  }

  UpdateData() {
    let raceIds: { name: string; id: string }[] = [];

    const data = this.raceDataService.Datasets();
    const races = data[this.selectedYear()].results;
    const keys = Object.keys(races);

    for (let key of keys) {
      let race = races[+key];
      raceIds.push({ id: key, name: race.race || (+key + 1).toString() });
    }

    this.raceIds.set(raceIds);
    this.CalculateSeasonScores();
  }

  CalculateSeasonScores() {
    let b = this.raceDataService.DriverToTeam('2025', 0, 'Tsunoda');

    const data = this.raceDataService.Datasets();
    const races = data[this.selectedYear()].results;
    const racePredictions = data[this.selectedYear()].predictions;

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
          winnerScore = this.CalculateWinnerScore(race.id, race.winner, prediction.winner);
        }

        if (prediction.dnf) {
          dnfScore = this.CalculateDNFScore(race.id, race.dnfs, prediction.dnf);
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
    console.log(totalScores);
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

  CalculateWinnerScore(id: number, target: string, prediction: string): number {
    if (target === prediction) {
      return 3;
    }

    var targetTeam = this.raceDataService.DriverToTeam(this.selectedYear(), id, target);
    var predictionTeam = this.raceDataService.DriverToTeam(this.selectedYear(), id, prediction);

    if (targetTeam === predictionTeam) {
      return 1;
    }

    return 0;
  }

  CalculateDNFScore(id: number, dnfs: string[], prediction: string): number {
    if (prediction === 'Nobody' && dnfs.length === 0) {
      return 3;
    }

    if (dnfs.indexOf(prediction) != -1) {
      return 3;
    }

    const dnfTeams = dnfs.map((driver) =>
      this.raceDataService.DriverToTeam(this.selectedYear(), id, driver)
    );

    var predictionTeam = this.raceDataService.DriverToTeam(this.selectedYear(), id, prediction);

    if (dnfTeams.indexOf(predictionTeam) != -1) {
      return 1;
    }

    return 0;
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
    this.UpdateData();

    const newRaceId = this.raceIds()[this.raceIds().length - 1];
    this.selectedRaceId.set(newRaceId.id);
  }
}
