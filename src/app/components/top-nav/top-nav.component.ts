import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmIcon, NgIcon],
  providers: [provideIcons({ lucideGithub })],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  navItems = signal([
    // { label: '2026', url: '/2026' },
    { label: 'Test Season', url: '/test' },
    { label: 'Legacy Seasons', url: '/legacy' },
  ]);

  activeItem = input<string>();
  mobileMenuOpen = signal(false);
}
