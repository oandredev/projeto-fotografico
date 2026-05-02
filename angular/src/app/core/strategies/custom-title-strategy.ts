import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  constructor(private title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);

    if (pageTitle) {
      this.title.setTitle(`${pageTitle} | LC - Photo & Video`);
    } else {
      this.title.setTitle('Larissa Calegaro - Photo & Video');
    }
  }
}