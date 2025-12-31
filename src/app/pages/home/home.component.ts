import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TopNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
