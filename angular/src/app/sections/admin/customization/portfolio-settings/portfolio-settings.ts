import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioCategory, PortfolioImage } from '../../../../core/types/types';
// TODO: import { HttpClient } from '@angular/common/http';

const MOCK_CATEGORIES: PortfolioCategory[] = [
  {
    id: 'cat-1',
    name: 'Casamentos',
    images: [
      { id: 'img-1', preview: 'https://picsum.photos/seed/w1/400/400' },
      { id: 'img-2', preview: 'https://picsum.photos/seed/w2/400/400' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Ensaios',
    images: [{ id: 'img-3', preview: 'https://picsum.photos/seed/e1/400/400' }],
  },
  {
    id: 'cat-3',
    name: 'Eventos',
    images: [],
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-portfolio-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-settings.html',
  styleUrls: ['./portfolio-settings.css'],
})
export class PortfolioSettings implements OnInit {
  readonly MAX_PHOTOS = 20;

  // TODO: private http = inject(HttpClient);

  // ── Estado ──────────────────────────────────────────────────────────────────

  categories = signal<PortfolioCategory[]>([]);
  selectedCategory = signal<PortfolioCategory | null>(null);

  dropdownOpen = signal(false);
  showAddForm = signal(false);
  newCategoryName = signal('');

  editingId = signal<string | null>(null);
  editingName = signal('');

  dragIndex = signal<number | null>(null);

  catDragIndex = signal<number | null>(null);
  catDragOverIndex = signal<number | null>(null);

  private _snapshot = '';

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadCategories();
  }

  // ── Detecção de alterações ───────────────────────────────────────────────────

  hasChanges(): boolean {
    return JSON.stringify(this.categories()) !== this._snapshot;
  }

  private snapshot(): void {
    this._snapshot = JSON.stringify(this.categories());
  }

  // ── Carregar categorias ──────────────────────────────────────────────────────

  loadCategories(): void {
    // TODO: substituir pelo endpoint real
    // this.http.get<PortfolioCategory[]>('/api/portfolio/categories').subscribe(data => {
    //   this.categories.set(data);
    //   this.snapshot();
    // });

    this.categories.set(structuredClone(MOCK_CATEGORIES));
    this.snapshot();
  }

  // ── Salvar / reverter ────────────────────────────────────────────────────────

  saveSettings(): void {
    // TODO: enviar para Node.js
    // const payload = this.categories().map(cat => ({
    //   id: cat.id,
    //   name: cat.name,
    //   imageIds: cat.images.map(i => i.id),
    // }));
    // this.http.put('/api/portfolio/categories', payload).subscribe(() => {
    //   this.snapshot();
    // });

    console.log('[mock] saveSettings', this.categories());
    this.snapshot();
  }

  reloadSettings(): void {
    // TODO: recarregar do servidor
    this.loadCategories();
    const currentId = this.selectedCategory()?.id;
    const found = this.categories().find((c) => c.id === currentId) ?? null;
    this.selectedCategory.set(found);
  }

  // ── Dropdown ─────────────────────────────────────────────────────────────────

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  selectCategory(cat: PortfolioCategory): void {
    this.selectedCategory.set(cat);
    this.dropdownOpen.set(false);
  }

  // ── Adicionar categoria ──────────────────────────────────────────────────────

  openAddCategory(): void {
    this.dropdownOpen.set(false);
    this.showAddForm.set(true);
    this.newCategoryName.set('');
  }

  confirmAdd(): void {
    const name = this.newCategoryName().trim();
    if (!name) return;

    // TODO: POST /api/portfolio/categories { name } → recebe { id, name, images: [] }
    // this.http.post<PortfolioCategory>('/api/portfolio/categories', { name }).subscribe(cat => {
    //   this.categories.update(list => [...list, cat]);
    //   this.selectedCategory.set(cat);
    // });

    const newCat: PortfolioCategory = { id: this._uid(), name, images: [] };
    this.categories.update((list) => [...list, newCat]);
    this.selectedCategory.set(newCat);
    this.showAddForm.set(false);
    this.newCategoryName.set('');
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
    this.newCategoryName.set('');
  }

  // ── Editar categoria ─────────────────────────────────────────────────────────

  startEdit(cat: PortfolioCategory): void {
    this.editingId.set(cat.id);
    this.editingName.set(cat.name);
  }

  confirmEdit(cat: PortfolioCategory): void {
    const name = this.editingName().trim();
    if (!name) return;

    // TODO: PATCH /api/portfolio/categories/:id { name }
    // this.http.patch(`/api/portfolio/categories/${cat.id}`, { name }).subscribe(() => { ... });

    this.categories.update((list) => list.map((c) => (c.id === cat.id ? { ...c, name } : c)));

    if (this.selectedCategory()?.id === cat.id) {
      this.selectedCategory.update((sc) => (sc ? { ...sc, name } : null));
    }

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingName.set('');
  }

  // ── Excluir categoria ────────────────────────────────────────────────────────

  deleteCategory(index: number): void {
    const cat = this.categories()[index];

    // TODO: DELETE /api/portfolio/categories/:id
    // this.http.delete(`/api/portfolio/categories/${cat.id}`).subscribe(() => { ... });

    this.categories.update((list) => list.filter((_, i) => i !== index));

    if (this.selectedCategory()?.id === cat.id) {
      const remaining = this.categories();
      this.selectedCategory.set(remaining[Math.min(index, remaining.length - 1)] ?? null);
    }
  }

  // ── Upload de fotos ──────────────────────────────────────────────────────────

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const current = this.selectedCategory();
    if (!current) return;

    const slots = this.MAX_PHOTOS - current.images.length;
    const toAdd = files.slice(0, slots);

    toAdd.forEach((file) => {
      // TODO: enviar ao Node.js com FormData e usar a URL retornada
      // const form = new FormData();
      // form.append('file', file);
      // form.append('categoryId', current.id);
      // this.http.post<PortfolioImage>('/api/portfolio/images', form).subscribe(img => {
      //   this._pushImage(current.id, img);
      // });

      // Mock: lê localmente para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const img: PortfolioImage = {
          id: this._uid(),
          preview: e.target?.result as string,
          filename: file.name,
        };
        this._pushImage(current.id, img);
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  private _pushImage(categoryId: string, img: PortfolioImage): void {
    this.categories.update((list) =>
      list.map((cat) => (cat.id === categoryId ? { ...cat, images: [...cat.images, img] } : cat)),
    );
    this.selectedCategory.update((sc) =>
      sc?.id === categoryId ? { ...sc, images: [...sc.images, img] } : sc,
    );
  }

  // ── Remover foto ─────────────────────────────────────────────────────────────

  removePhoto(index: number): void {
    const current = this.selectedCategory();
    if (!current) return;

    // TODO: DELETE /api/portfolio/images/:id
    // const img = current.images[index];
    // this.http.delete(`/api/portfolio/images/${img.id}`).subscribe(() => { ... });

    this.categories.update((list) =>
      list.map((cat) =>
        cat.id === current.id ? { ...cat, images: cat.images.filter((_, i) => i !== index) } : cat,
      ),
    );
    this.selectedCategory.update((sc) =>
      sc ? { ...sc, images: sc.images.filter((_, i) => i !== index) } : sc,
    );
  }

  // ── Drag & Drop (reordenar categorias) ──────────────────────────────────────

  onCatDragStart(index: number): void {
    this.catDragIndex.set(index);
  }

  onCatDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.catDragOverIndex.set(index);
  }

  onCatDrop(targetIndex: number): void {
    const from = this.catDragIndex();
    if (from === null || from === targetIndex) {
      this.onCatDragEnd();
      return;
    }

    const reordered = [...this.categories()];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(targetIndex, 0, moved);

    // TODO: PATCH /api/portfolio/categories/order { categoryIds: reordered.map(c => c.id) }

    this.categories.set(reordered);
    this.onCatDragEnd();
  }

  onCatDragEnd(): void {
    this.catDragIndex.set(null);
    this.catDragOverIndex.set(null);
  }

  // ── Drag & Drop (reordenar fotos) ────────────────────────────────────────────

  onDragStart(index: number): void {
    this.dragIndex.set(index);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(targetIndex: number): void {
    const from = this.dragIndex();
    if (from === null || from === targetIndex) return;

    const current = this.selectedCategory();
    if (!current) return;

    const imgs = [...current.images];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(targetIndex, 0, moved);

    // TODO: PATCH /api/portfolio/categories/:id/order { imageIds: imgs.map(i=>i.id) }

    this.categories.update((list) =>
      list.map((cat) => (cat.id === current.id ? { ...cat, images: imgs } : cat)),
    );
    this.selectedCategory.update((sc) => (sc ? { ...sc, images: imgs } : sc));
    this.dragIndex.set(null);
  }

  onDragEnd(): void {
    this.dragIndex.set(null);
  }

  // ── Utils ────────────────────────────────────────────────────────────────────

  private _uid(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
