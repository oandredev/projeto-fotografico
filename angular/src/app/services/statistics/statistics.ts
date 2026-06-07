import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { CustomerService } from '../customer/customer';
import { MessageService } from '../message/message';
import { PortfolioCategoryService } from '../portfolio-category/portfolio-category';

import { Customer, Message, PortfolioCategory } from '../../core/types/types';

import { DashboardStats, PeriodFilter, CategoryItem } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private portfolioCategoryService: PortfolioCategoryService,
  ) {}

  getDashboard(): Observable<DashboardStats> {
    return forkJoin({
      customers: this.customerService.getStats(),
      messages: this.messageService.getStats(),
      categories: this.portfolioCategoryService.getAll(),
    }).pipe(
      map(({ customers, messages, categories }) => {
        const portfolioCategories: CategoryItem[] = categories.map((category) => ({
          name: category.name,
          photos: 0,
          views: 0,
          color: this.getCategoryColor(category.order_index),
        }));

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
            categoriasAtivas: categories.length,
            fotosArmazenadas: 0,
            visualizacoes: 0,
            categorias: portfolioCategories,
          },
        };
      }),
    );
  }

  private countCustomers(customers: Customer[], period: PeriodFilter): number {
    return this.filterByPeriod(customers, (customer) => customer.register, period);
  }

  private countMessages(messages: Message[], period: PeriodFilter): number {
    return this.filterByPeriod(messages, (message) => message.date, period);
  }

  private filterByPeriod<T>(
    items: T[],
    getDate: (item: T) => string | undefined,
    period: PeriodFilter,
  ): number {
    const now = new Date();

    return items.filter((item) => {
      const value = getDate(item);

      if (!value) {
        return false;
      }

      const date = new Date(value);

      switch (period) {
        case 'day':
          return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );

        case 'week': {
          const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

          return diff <= 7;
        }

        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

        case 'year':
          return date.getFullYear() === now.getFullYear();
      }
    }).length;
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
