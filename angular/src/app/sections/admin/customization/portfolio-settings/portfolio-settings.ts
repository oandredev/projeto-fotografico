import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, switchMap, forkJoin } from 'rxjs';
import { environment } from '../../../../environment';
import { PortfolioService } from '../../../../services/portfolio/portfolio';
import { PortfolioCategoryService } from '../../../../services/portfolio-category/portfolio-category';
import { LocalCategory } from '../../../../core/types/types';
import { APP_ANIMATIONS } from '../../../../shared/animations/animation';

@Component({
  selector: 'app-portfolio-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-settings.html',
  styleUrls: ['./portfolio-settings.css'],
  animations: [APP_ANIMATIONS],
})
export class PortfolioSettings implements OnInit {
  constructor(
    private portfolioService: PortfolioService,
    private portfolioCategoryService: PortfolioCategoryService,
  ) {}

  readonly MAX_PHOTOS = 20;

  categories = signal<LocalCategory[]>([]);
  selectedCategory = signal<LocalCategory | null>(null);

  private _originalOrder = signal<number[]>([]);

  dropdownOpen = signal(false);
  showAddForm = signal(false);
  newCategoryName = signal('');
  editingId = signal<number | null>(null);
  editingName = signal('');
  dragIndex = signal<number | null>(null);
  catDragIndex = signal<number | null>(null);
  catDragOverIndex = signal<number | null>(null);

  private _tempIdSeq = -1;
  private nextTempId() {
    return this._tempIdSeq--;
  }

  hasChanges = computed(() => {
    const cats = this.categories();
    const order = this._originalOrder();

    const hasNew = cats.some((c) => c.originalId === 0);
    const hasRename = cats.some((c) => c.originalId !== 0 && c.name !== c.originalName);
    const hasReorder = cats.some((c, i) => c.originalId !== (order[i] ?? null));

    const hasPhotoChanges = cats.some((c) => {
      if (c.originalId === 0) return c.images.length > 0;
      if (c.images.some((img) => img.file !== null)) return true;

      const currentPreviews = c.images.filter((img) => img.file === null).map((img) => img.preview);

      if (currentPreviews.length !== c.originalImagePreviews.length) return true;

      return currentPreviews.some((p, i) => p !== c.originalImagePreviews[i]);
    });

    return hasNew || hasRename || hasReorder || hasPhotoChanges;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      categories: this.portfolioCategoryService.getAll(),
      portfolios: this.portfolioService.getAll(),
    }).subscribe({
      next: ({ categories, portfolios }) => {
        const mapped: LocalCategory[] = categories.map((category) => {
          const portfolio = portfolios.find((p) => p.category_id === category.id);
          const previews =
            portfolio?.image_urls.map((url) => `http://localhost:${environment.API_PORT}${url}`) ??
            [];

          return {
            id: category.id,
            originalId: category.id,
            originalName: category.name,
            originalImagePreviews: [...previews],
            name: category.name,
            order_index: category.order_index,
            portfolioId: portfolio?.id,
            images: previews.map((preview) => ({ file: null, preview })),
          };
        });

        this.categories.set(mapped);
        this._originalOrder.set(mapped.map((c) => c.id));
        this.selectedCategory.set(mapped[0] ?? null);
      },
      error: console.error,
    });
  }

  reloadSettings(): void {
    this.loadData();
  }

  // Dropdown
  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  selectCategory(cat: LocalCategory) {
    this.selectedCategory.set(cat);
    this.dropdownOpen.set(false);
  }

  // Add Category (Local)
  openAddCategory() {
    this.dropdownOpen.set(false);
    this.showAddForm.set(true);
    this.newCategoryName.set('');
  }

  confirmAdd() {
    const name = this.newCategoryName().trim();
    if (!name) return;

    const duplicate = this.categories().some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      alert('Não é possível criar categorias com o mesmo nome.');
      return;
    }

    const newCat: LocalCategory = {
      id: this.nextTempId(),
      originalId: 0,
      originalName: '',
      originalImagePreviews: [],
      name,
      order_index: this.categories().length + 1,
      images: [],
    };

    this.categories.update((cats) => [...cats, newCat]);
    this.showAddForm.set(false);
    this.newCategoryName.set('');
  }

  cancelAdd() {
    this.showAddForm.set(false);
    this.newCategoryName.set('');
  }

  // Rename Category (Local)
  startEdit(cat: LocalCategory) {
    this.editingId.set(cat.id);
    this.editingName.set(cat.name);
  }

  confirmEdit(cat: LocalCategory) {
    const name = this.editingName().trim();
    if (!name) return;

    const duplicate = this.categories().some(
      (c) => c.id !== cat.id && c.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      alert('Não é possível utilizar um nome já existente.');
      return;
    }

    this.categories.update((cats) => cats.map((c) => (c.id === cat.id ? { ...c, name } : c)));

    if (this.selectedCategory()?.id === cat.id) {
      this.selectedCategory.update((sel) => (sel ? { ...sel, name } : null));
    }

    this.editingId.set(null);
    this.editingName.set('');
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editingName.set('');
  }

  deleteCategory(index: number) {
    const cat = this.categories()[index];
    if (!cat) return;

    if (
      !confirm(
        `Tem certeza que deseja excluir a categoria: "${cat.name}"?\n` +
          `Todas as fotos associadas serão removidas também. Esta ação não pode ser desfeita!`,
      )
    )
      return;

    if (cat.originalId === 0) {
      this.categories.update((cats) => cats.filter((_, i) => i !== index));
      if (this.selectedCategory()?.id === cat.id) {
        this.selectedCategory.set(this.categories()[0] ?? null);
      }
      return;
    }

    this.portfolioCategoryService.delete(cat.originalId).subscribe({
      next: () => this.loadData(),
      error: console.error,
    });
  }

  onDragStart(index: number) {
    this.dragIndex.set(index);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDragEnd() {
    this.dragIndex.set(null);
  }

  onDrop(index: number) {
    const source = this.dragIndex();
    if (source === null) return;

    const cat = this.selectedCategory();
    if (!cat) return;

    const images = [...cat.images];
    const [item] = images.splice(source, 1);
    images.splice(index, 0, item);
    this._updateSelectedImages(cat, images);
    this.dragIndex.set(null);
  }

  onCatDragStart(index: number) {
    this.catDragIndex.set(index);
  }
  onCatDragEnd() {
    this.catDragIndex.set(null);
    this.catDragOverIndex.set(null);
  }

  onCatDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.catDragOverIndex.set(index);
  }

  onCatDrop(index: number) {
    const source = this.catDragIndex();
    if (source === null) return;

    const cats = [...this.categories()];
    const [item] = cats.splice(source, 1);
    cats.splice(index, 0, item);
    cats.forEach((c, i) => (c.order_index = i + 1));

    this.categories.set(cats);
    this.catDragIndex.set(null);
    this.catDragOverIndex.set(null);
  }

  removePhoto(index: number) {
    const cat = this.selectedCategory();
    if (!cat) return;

    const images = [...cat.images];
    images.splice(index, 1);
    this._updateSelectedImages(cat, images);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const cat = this.selectedCategory();
    if (!cat) return;

    const remaining = this.MAX_PHOTOS - cat.images.length;
    if (remaining <= 0) {
      input.value = '';
      return;
    }

    const images = [...cat.images];
    Array.from(input.files)
      .slice(0, remaining)
      .forEach((file) => images.push({ file, preview: URL.createObjectURL(file) }));

    this._updateSelectedImages(cat, images);
    input.value = '';
  }

  // Save ALl Changes

  saveChanges() {
    const cats = this.categories();

    const newCats = cats.filter((c) => c.originalId === 0);
    const existingCats = cats.filter((c) => c.originalId !== 0);

    const updateRequests = existingCats.map((c) =>
      this.portfolioCategoryService.update(c.originalId, {
        name: c.name,
        order_index: c.order_index,
      }),
    );

    const existingPhotoRequests = existingCats.map((c) => {
      const files = c.images.filter((img) => img.file !== null).map((img) => img.file as File);
      const existingImages = c.images
        .filter((img) => img.file === null)
        .map((img) => img.preview.replace(`http://localhost:${environment.API_PORT}`, ''));

      return this.portfolioService.save(c.portfolioId ?? null, c.originalId, existingImages, files);
    });

    const baseRequests = [...updateRequests, ...existingPhotoRequests];

    if (newCats.length === 0) {
      forkJoin(baseRequests.length ? baseRequests : [of(null)]).subscribe({
        next: () => this.loadData(),
        error: console.error,
      });
      return;
    }

    // 1) Cria as novas categorias
    forkJoin(
      newCats.map((c) =>
        this.portfolioCategoryService.create({ name: c.name, order_index: c.order_index }),
      ),
    )
      .pipe(
        // 2) Busca a lista atualizada para obter os IDs reais pelo nome
        switchMap(() => this.portfolioCategoryService.getAll()),
      )
      .subscribe({
        next: (allCategories) => {
          const newPhotoRequests = newCats
            .map((c) => {
              const realId = allCategories.find(
                (a) => a.name.toLowerCase() === c.name.toLowerCase(),
              )?.id;

              if (!realId || c.images.length === 0) return null;

              const files = c.images
                .filter((img) => img.file !== null)
                .map((img) => img.file as File);
              const existingImages = c.images
                .filter((img) => img.file === null)
                .map((img) => img.preview.replace(`http://localhost:${environment.API_PORT}`, ''));

              return this.portfolioService.save(null, realId, existingImages, files);
            })
            .filter((r) => r !== null);

          const allRemaining = [...baseRequests, ...newPhotoRequests];

          if (allRemaining.length === 0) {
            this.loadData();
            return;
          }

          forkJoin(allRemaining).subscribe({
            next: () => this.loadData(),
            error: console.error,
          });
        },
        error: console.error,
      });
  }

  // Utils
  private _updateSelectedImages(cat: LocalCategory, images: LocalCategory['images']) {
    const updated = { ...cat, images };
    this.categories.update((cats) => cats.map((c) => (c.id === cat.id ? updated : c)));
    this.selectedCategory.set(updated);
  }
}
