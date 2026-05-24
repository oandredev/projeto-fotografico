import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroService } from '../../../services/hero/hero';
import { environment } from '../../../environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {
  constructor(private heroService: HeroService) {}

  slogan = signal('');
  imageUrls = signal<string[]>([]);

  readonly API_URL = `http://localhost:${environment.API_PORT}`;

  ngOnInit(): void {
    this.heroService.find().subscribe({
      next: (hero) => {
        if (!hero) return;
        this.slogan.set(hero.slogan ?? '');
        this.imageUrls.set(hero.imageUrls ?? []);
      },
      error: (err) => console.error(err),
    });
  }
}
