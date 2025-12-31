import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  navItems = signal([
    { label: '2026', url: '/2026' },
    { label: 'Test', url: '/test' },
    { label: 'Legacy Seasons', url: '/legacy' },
  ]);

  activeItem = input<string>();
  mobileMenuOpen = signal(false);
}
