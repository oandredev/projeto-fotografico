import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { CustomerService } from '../customer/customer';
import { MessageService } from '../message/message';
import { PortfolioService } from '../portfolio/portfolio';
import { PortfolioCategoryService } from '../portfolio-category/portfolio-category';
import { DashboardStats } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private portfolioCategoryService: PortfolioCategoryService,
    private portfolioService: PortfolioService,
  ) {}

  getDashboard(): Observable<DashboardStats> {
    return forkJoin({
      customers: this.customerService.getStats(),
      messages: this.messageService.getStats(),
      portfolio: this.portfolioService.getStats(),
      categories: this.portfolioCategoryService.getAll(),
    }).pipe(
      map(({ customers, messages, portfolio, categories }) => {
        return {
          clientes: {
            total: customers.total,
            favoritos: customers.favoritos,
            arquivados: customers.arquivados,

            cadastros: {
              day: { value: customers.day, label: 'hoje' },
              week: { value: customers.week, label: 'esta semana' },
              month: { value: customers.month, label: 'este mês' },
              year: { value: customers.year, label: 'este ano' },
            },
          },

          mensagens: {
            total: messages.total,
            favoritas: messages.favoritas,
            arquivadas: messages.arquivadas,
            ativas: messages.ativas,

            recebidas: {
              day: {
                value: messages.day,
                label: 'hoje',
              },
              week: {
                value: messages.week,
                label: 'esta semana',
              },
              month: {
                value: messages.month,
                label: 'este mês',
              },
              year: {
                value: messages.year,
                label: 'este ano',
              },
            },
          },

          portfolio: {
            categoriasAtivas: portfolio.categoriasAtivas,
            fotosArmazenadas: portfolio.fotosArmazenadas,
            visualizacoes: portfolio.visualizacoes,

            categorias: categories.map((category) => {
              const stat = portfolio.categorias.find((c) => c.category_id === category.id);

              return {
                name: category.name,
                photos: stat?.photos ?? 0,
                views: stat?.views ?? 0,
                color: this.getCategoryColor(category.order_index),
              };
            }),
          },
          categorias: categories.map((category) => {
            const stat = portfolio.categorias.find((c) => c.category_id === category.id);

            return {
              name: category.name,
              photos: stat?.photos ?? 0,
              views: stat?.views ?? 0,
              color: this.getCategoryColor(category.order_index),
            };
          }),
        };
      }),
    );
  }

  private getCategoryColor(order: number): string {
    const colors = [
      '#7F77DD',
      '#1D9E75',
      '#D85A30',
      '#378ADD',
      '#D4537E',
      '#BA7517',
      '#888780',
      '#639922',
    ];

    return colors[order % colors.length];
  }
}
