import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlagsDataServiceV1 } from './services/race-results-v1.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('how-many-flags');
  private raceDataService = inject(FlagsDataServiceV1);
}
