import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PortfolioService } from '../../../services/portfolio/portfolio';
import { PortfolioCategoryService } from '../../../services/portfolio-category/portfolio-category';
import { environment } from '../../../environment';
import { LightBox } from '../../../components/public/light-box/light-box';

interface PortfolioCard {
  categoryId: number;
  categoryName: string;
  coverUrl: string;
  allUrls: string[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, LightBox],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit {
  @ViewChild('lightbox') lightbox!: LightBox;

  private portfolioService = inject(PortfolioService);
  private portfolioCategoryService = inject(PortfolioCategoryService);

  cards = signal<PortfolioCard[]>([]);

  ngOnInit(): void {
    forkJoin({
      portfolios: this.portfolioService.getAll(),
      categories: this.portfolioCategoryService.getAll(),
    }).subscribe({
      next: ({ portfolios, categories }) => {
        const result = portfolios
          .filter((p) => p.image_urls?.length)
          .map((p) => ({
            categoryId: p.category_id,
            categoryName: categories.find((c) => c.id === p.category_id)?.name ?? '',
            coverUrl: `http://localhost:${environment.API_PORT}${p.image_urls[0]}`,
            allUrls: p.image_urls.map((url) => `http://localhost:${environment.API_PORT}${url}`),
          }));

        this.cards.set(result);
      },
      error: console.error,
    });
  }

  openLightbox(cardIndex: number): void {
    const card = this.cards()[cardIndex];
    if (!card) return;
    this.portfolioCategoryService.incrementView(card.categoryId).subscribe();
    this.lightbox.open(card.allUrls, 0, card.categoryName);
  }
}
