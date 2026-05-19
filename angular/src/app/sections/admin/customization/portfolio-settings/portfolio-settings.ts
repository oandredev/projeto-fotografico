import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type CategoriaEnum =
  | 'newborn'
  | 'gestante'
  | 'familia'
  | 'aniversario'
  | 'parto'
  | 'acompanhamento';

export interface Midia {
  id: number;
  categoria: CategoriaEnum;
  tipo: 'foto' | 'video';
  /** URL pública retornada pela API (ex.: /uploads/midia-42.jpg) */
  url: string;
  /** Posição na categoria; 0 = foto de capa */
  ordem: number;
}

// ─── Constantes ─────────────────────────────────────────────────────────────

const API_BASE = '/api';
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Componente ─────────────────────────────────────────────────────────────

@Component({
  selector: 'app-portfolio-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-settings.html',
  styleUrl: './portfolio-settings.css',
})
export class PortfolioSettings implements OnInit {
  private http = inject(HttpClient);

  // ── Categorias (espelha o ENUM do banco) ──────────────────────────────────
  readonly categories: { value: CategoriaEnum; label: string }[] = [
    { value: 'newborn', label: 'Newborn' },
    { value: 'gestante', label: 'Gestante' },
    { value: 'familia', label: 'Família' },
    { value: 'aniversario', label: 'Aniversário' },
    { value: 'parto', label: 'Parto' },
    { value: 'acompanhamento', label: 'Acompanhamento' },
  ];

  // ── Signals de estado ─────────────────────────────────────────────────────
  selectedCategory = signal<CategoriaEnum>('newborn');
  mediaList = signal<Midia[]>([]);
  loading = signal(false);

  // Modal
  showUploadModal = signal(false);
  isDragging = signal(false);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);

  // Dados do upload (não precisam ser signals — são efêmeros)
  uploadCategory: CategoriaEnum = 'newborn';
  private selectedFile: File | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  // Ciclo de vida
  // ─────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadMedia();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Seleção de categoria
  // ─────────────────────────────────────────────────────────────────────────

  selectCategory(value: CategoriaEnum): void {
    if (this.selectedCategory() === value) return;
    this.selectedCategory.set(value);
    this.loadMedia();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Carregamento da galeria
  // ─────────────────────────────────────────────────────────────────────────

  private loadMedia(): void {
    this.loading.set(true);
    this.mediaList.set([]);

    this.http
      .get<Midia[]>(`${API_BASE}/midia`, {
        params: { categoria: this.selectedCategory() },
      })
      .subscribe({
        next: (items) => {
          // Garante que a lista vem ordenada pelo campo `ordem`
          const sorted = [...items].sort((a, b) => a.ordem - b.ordem);
          this.mediaList.set(sorted);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao carregar mídias:', err);
          this.loading.set(false);
        },
      });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Definir capa
  // Envia PATCH /api/midia/:id/cover → API reordena (ordem = 0 para este id)
  // ─────────────────────────────────────────────────────────────────────────

  setCover(media: Midia): void {
    this.http.patch<void>(`${API_BASE}/midia/${media.id}/cover`, {}).subscribe({
      next: () => this.loadMedia(),
      error: (err: HttpErrorResponse) => console.error('Erro ao definir capa:', err),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Remover mídia
  // ─────────────────────────────────────────────────────────────────────────

  deleteMedia(media: Midia): void {
    if (!confirm('Remover esta foto do portfólio?')) return;

    this.http.delete<void>(`${API_BASE}/midia/${media.id}`).subscribe({
      next: () => this.mediaList.update((list) => list.filter((m) => m.id !== media.id)),
      error: (err: HttpErrorResponse) => console.error('Erro ao remover mídia:', err),
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Modal de upload
  // ─────────────────────────────────────────────────────────────────────────

  openUploadModal(): void {
    this.uploadCategory = this.selectedCategory();
    this.showUploadModal.set(true);
  }

  closeUploadModal(): void {
    this.showUploadModal.set(false);
    this.clearPreview();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Seleção de arquivo (input ou drop)
  // ─────────────────────────────────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
    // Limpa o valor do input para permitir re-selecionar o mesmo arquivo
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Formato não suportado. Use JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`O arquivo excede o limite de ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearPreview(): void {
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Envio do upload
  // POST /api/midia  →  multipart/form-data com `file` e `categoria`
  // ─────────────────────────────────────────────────────────────────────────

  confirmUpload(): void {
    if (!this.selectedFile || this.uploading()) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('categoria', this.uploadCategory);

    this.uploading.set(true);

    this.http.post<Midia>(`${API_BASE}/midia`, formData).subscribe({
      next: (newMedia) => {
        this.uploading.set(false);
        this.closeUploadModal();

        // Se a foto foi adicionada na categoria ativa, atualiza o grid
        if (newMedia.categoria === this.selectedCategory()) {
          this.mediaList.update((list) => [...list, newMedia].sort((a, b) => a.ordem - b.ordem));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro no upload:', err);
        this.uploading.set(false);
        alert('Falha ao enviar a foto. Tente novamente.');
      },
    });
  }
}
