import { Component, inject, input } from '@angular/core';
import { legacyScoreCategory } from '../../pages/legacy-seasons/legacy-model';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-legacy-scoreblock',
  imports: [],
  templateUrl: './legacy-scoreblock.component.html',
  styleUrl: './legacy-scoreblock.component.css',
})
export class LegacyScoreblockComponent {
  public scoreCategory = input.required<legacyScoreCategory>();

  public avatars = inject(AvatarService);
}
