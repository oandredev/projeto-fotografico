import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type DashTab = 'clientes' | 'mensagens' | 'portfolio';
export type PeriodFilter = 'day' | 'week' | 'month' | 'year';

export interface PeriodData {
  value: number;
  label: string;
}

export interface CategoryItem {
  name: string;
  photos: number;
  views: number;
  color: string;
}

export interface DashboardStats {
  clientes: {
    total: number;
    favoritos: number;
    arquivados: number;
    cadastros: Record<PeriodFilter, PeriodData>;
  };
  mensagens: {
    total: number;
    favoritas: number;
    arquivadas: number;
    ativas: number;
    recebidas: Record<PeriodFilter, PeriodData>;
  };
  portfolio: {
    categoriasAtivas: number;
    fotosArmazenadas: number;
    visualizacoes: number;
    fotoMaisVista: string;
    fotoMaisVistaDetalhes: string;
    categoriaEmAlta: string;
    categoriaEmAltaPercent: number;
    tempoMedio: string;
    categorias: CategoryItem[];
  };
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
  activeTab = signal<DashTab>('clientes');
  clientePeriod = signal<PeriodFilter>('week');
  mensagemPeriod = signal<PeriodFilter>('week');

  // --- MOCK DATA — substituir por chamadas de serviço futuramente ---
  stats: DashboardStats = {
    clientes: {
      total: 248,
      favoritos: 37,
      arquivados: 19,
      cadastros: {
        day: { value: 3, label: 'hoje' },
        week: { value: 14, label: 'esta semana' },
        month: { value: 52, label: 'este mês' },
        year: { value: 248, label: 'este ano' },
      },
    },
    mensagens: {
      total: 1842,
      favoritas: 92,
      arquivadas: 310,
      ativas: 1440,
      recebidas: {
        day: { value: 11, label: 'hoje' },
        week: { value: 63, label: 'esta semana' },
        month: { value: 214, label: 'este mês' },
        year: { value: 1842, label: 'este ano' },
      },
    },
    portfolio: {
      categoriasAtivas: 8,
      fotosArmazenadas: 634,
      visualizacoes: 12400,
      fotoMaisVista: 'Casamento Silva',
      fotoMaisVistaDetalhes: '348 views · Casamentos',
      categoriaEmAlta: 'Newborn',
      categoriaEmAltaPercent: 38,
      tempoMedio: '4 min 12 s',
      categorias: [
        { name: 'Casamentos', photos: 148, views: 4210, color: '#7F77DD' },
        { name: 'Ensaios', photos: 112, views: 2980, color: '#1D9E75' },
        { name: 'Newborn', photos: 98, views: 2640, color: '#D85A30' },
        { name: 'Família', photos: 87, views: 1870, color: '#378ADD' },
        { name: 'Gestante', photos: 72, views: 1520, color: '#D4537E' },
        { name: 'Corporativo', photos: 61, views: 890, color: '#BA7517' },
        { name: 'Eventos', photos: 43, views: 720, color: '#888780' },
        { name: 'Editorial', photos: 13, views: 310, color: '#639922' },
      ],
    },
  };

  // --- COMPUTED ---
  maxPhotos = computed(() => Math.max(...this.stats.portfolio.categorias.map((c) => c.photos)));

  clienteCadastros = computed(() => this.stats.clientes.cadastros[this.clientePeriod()]);

  mensagensRecebidas = computed(() => this.stats.mensagens.recebidas[this.mensagemPeriod()]);

  mensagensAtivasPercent = computed(() =>
    Math.round((this.stats.mensagens.ativas / this.stats.mensagens.total) * 100),
  );

  mensagensArquivadasPercent = computed(() =>
    Math.round((this.stats.mensagens.arquivadas / this.stats.mensagens.total) * 100),
  );

  mensagensFavoritasPercent = computed(() =>
    Math.round((this.stats.mensagens.favoritas / this.stats.mensagens.total) * 100),
  );

  visualizacoesFormatted = computed(() => {
    const v = this.stats.portfolio.visualizacoes;
    return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toString();
  });

  // --- ACTIONS ---
  setTab(tab: DashTab): void {
    this.activeTab.set(tab);
  }

  setClientePeriod(period: PeriodFilter): void {
    this.clientePeriod.set(period);
  }

  setMensagemPeriod(period: PeriodFilter): void {
    this.mensagemPeriod.set(period);
  }

  barWidth(photos: number): string {
    return Math.round((photos / this.maxPhotos()) * 100) + '%';
  }

  sparkHeight(val: number, max: number): number {
    return Math.max(4, Math.round((val / max) * 100));
  }

  formatViews(views: number): string {
    return views.toLocaleString('pt-BR');
  }
}
