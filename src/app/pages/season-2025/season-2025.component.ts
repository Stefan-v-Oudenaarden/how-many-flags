import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlagsDataServiceV1, SeasonPredictionsV1 } from '../../services/race-results-v1.service';
import { PredictionEditorComponent } from '../../components/prediction-editor/prediction-editor.component';
import { ResultEditorComponent } from '../../components/result-editor/result-editor.component';

@Component({
  selector: 'app-season-2025',
  imports: [CommonModule, FormsModule, PredictionEditorComponent, ResultEditorComponent],
  templateUrl: './season-2025.component.html',
  styleUrl: './season-2025.component.css',
})
export class Season2025Component {
  public selectedRaceId = signal<string>('0');
  public selectedYear = signal<string>('2025');

  public raceData: SeasonPredictionsV1 = {};
  public raceDataService = inject(FlagsDataServiceV1);

  public raceNumbers: string[] = [];
  public participants: string[] = [];
  public dataLoaded = false;
}
