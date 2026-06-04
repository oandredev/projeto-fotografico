import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PortfolioService } from '../../../services/portfolio/portfolio';
import { PortfolioCategoryService } from '../../../services/portfolio-category/portfolio-category';
import { environment } from '../../../environment';

interface PortfolioCard {
  categoryName: string;
  coverUrl: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit {
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
            categoryName: categories.find((c) => c.id === p.category_id)?.name ?? '',
            coverUrl: `http://localhost:${environment.API_PORT}${p.image_urls[0]}`,
          }));

        this.cards.set(result);
      },
      error: console.error,
    });
  }
}
