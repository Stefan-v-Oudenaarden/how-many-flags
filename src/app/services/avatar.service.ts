import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  public Avatars: Map<string, { url: string; colour: string }> = new Map([
    ['Hannah', { url: '/avatars/hannah.png', colour: '#E6B3F0' }],
    ['Rose', { url: '/avatars/rose.png', colour: '#9B59B6' }],
    ['Wednesday', { url: '/avatars/wednesday.png', colour: '#2E5C8A' }],
    ['Shaun', { url: '/avatars/shaun.png', colour: '#F4E87C' }],
    ['Alice', { url: '/avatars/alice.png', colour: '#E8A5A5' }],
    ['MoonWolf', { url: '/avatars/moonwolf.png', colour: '#4A9B7F' }],
    ['CJ', { url: '/avatars/cj.png', colour: '#8FB3D5' }],
    ['Morrigan', { url: '/avatars/morrigan.png', colour: '#7EC8C3' }],
    ['Ben', { url: '/avatars/ben.png', colour: '#2C2C2C' }],
    ['Pidgeons', { url: '/avatars/pidgeons.png', colour: '#2C2C2C' }],
  ]);

  public getAvatarForPlayerName(name: string): string {
    const player = this.Avatars.get(name);

    if (player) {
      return player.url;
    }

    return '';
  }
}
