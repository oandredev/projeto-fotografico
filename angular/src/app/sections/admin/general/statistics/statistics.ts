import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { StatisticsService } from '../../../../services/statistics/statistics';
import { DashboardStats, PeriodFilter, DashTab } from '../../../../core/types/types';
import { APP_ANIMATIONS } from '../../../../shared/animations/animation';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
  animations: [APP_ANIMATIONS],
})
export class Statistics implements OnInit {
  constructor(private statisticsService: StatisticsService) {}

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  activeTab = signal<DashTab>('mensagens');
  clientePeriod = signal<PeriodFilter>('week');
  mensagemPeriod = signal<PeriodFilter>('week');

  ngOnInit(): void {
    this.loadDashboard();
  }

  maxPhotos = computed(() => {
    const stats = this.stats();
    if (!stats) {
      return 1;
    }
    return Math.max(...stats.portfolio.categorias.map((c) => c.photos), 1);
  });

  clienteCadastros = computed(() => {
    const stats = this.stats();
    if (!stats) {
      return {
        value: 0,
        label: '',
      };
    }
    return stats.clientes.cadastros[this.clientePeriod()];
  });

  mensagensRecebidas = computed(() => {
    const stats = this.stats();
    if (!stats) {
      return {
        value: 0,
        label: '',
      };
    }
    return stats.mensagens.recebidas[this.mensagemPeriod()];
  });

  mensagensAtivasPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.mensagens.total === 0) {
      return 0;
    }
    return Math.round((stats.mensagens.ativas / stats.mensagens.total) * 100);
  });

  mensagensFavoritasPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.mensagens.total === 0) {
      return 0;
    }
    return Math.round((stats.mensagens.favoritas / stats.mensagens.total) * 100);
  });

  mensagensArquivadasPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.mensagens.total === 0) {
      return 0;
    }
    return Math.round((stats.mensagens.arquivadas / stats.mensagens.total) * 100);
  });

  visualizacoesFormatted = computed(() => {
    const stats = this.stats();
    if (!stats) {
      return '0';
    }
    const value = stats.portfolio.visualizacoes;
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  });

  clientesTotalPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.clientes.total === 0) {
      return 0;
    }
    return 100;
  });

  clientesFavoritosPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.clientes.total === 0) {
      return 0;
    }
    return Math.round((stats.clientes.favoritos / stats.clientes.total) * 100);
  });

  clientesArquivadosPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.clientes.total === 0) {
      return 0;
    }
    return Math.round((stats.clientes.arquivados / stats.clientes.total) * 100);
  });

  clientesGeralPercent = computed(() => {
    const stats = this.stats();
    if (!stats || stats.clientes.total === 0) {
      return 0;
    }
    return Math.round((stats.clientes.geral / stats.clientes.total) * 100);
  });

  maxViews = computed(() => {
    const stats = this.stats();

    if (!stats) {
      return 1;
    }

    return Math.max(...stats.portfolio.categorias.map((c) => Number(c.views) || 0), 1);
  });

  categoriasSorted = computed(() => {
    const stats = this.stats();
    if (!stats) return [];
    // spread para não mutar o array original da signal
    return [...stats.portfolio.categorias].sort((a, b) => Number(b.views) - Number(a.views));
  });

  loadDashboard(): void {
    this.loading.set(true);

    this.statisticsService
      .getDashboard()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (stats: DashboardStats) => {
          this.stats.set(stats);
        },
        error: (error: unknown) => {
          console.error('Erro ao carregar dashboard:', error);
        },
      });
  }

  setTab(tab: DashTab): void {
    this.loadDashboard();
    this.activeTab.set(tab);
  }

  setClientePeriod(period: PeriodFilter): void {
    this.clientePeriod.set(period);
  }

  setMensagemPeriod(period: PeriodFilter): void {
    this.mensagemPeriod.set(period);
  }

  barWidth(views: number): string {
    return `${Math.round((views / this.maxViews()) * 100)}%`;
  }

  sparkHeight(value: number, max: number): number {
    if (!max) {
      return 4;
    }

    return Math.max(4, Math.round((value / max) * 100));
  }

  formatViews(views: number): string {
    return views.toLocaleString('pt-BR');
  }
}
