import { Component, inject, input } from '@angular/core';
import { legacyScoreCategory } from '../../pages/legacy-seasons/legacy-model';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-legacy-scoreblock-hero',
  imports: [],
  templateUrl: './legacy-scoreblock-hero.component.html',
  styleUrl: './legacy-scoreblock-hero.component.css',
})
export class LegacyScoreblockHeroComponent {
  public scoreCategory = input.required<legacyScoreCategory>();

  public avatars = inject(AvatarService);

  placeBackground(place?: number) {
    switch (place) {
      case 1:
        return 'bg-linear-to-r from-yellow-100 to-orange-100 shadow-md hover:shadow-lg';
      case 2:
        return 'bg-linear-to-r from-yellow-50 to-orange-100 shadow-md hover:shadow-lg';
      case 3:
        return 'bg-linear-to-r from-yellow-50 to-orange-50 shadow-md hover:shadow-lg';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  }
}
