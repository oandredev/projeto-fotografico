import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { environment } from '../../../../environment';

import { PortfolioCategoryView } from '../../../../core/types/types';

import { PortfolioService } from '../../../../services/portfolio/portfolio';
import { PortfolioCategoryService } from '../../../../services/portfolio-category/portfolio-category';

@Component({
  selector: 'app-portfolio-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-settings.html',
  styleUrls: ['./portfolio-settings.css'],
})
export class PortfolioSettings implements OnInit {
  constructor(
    private portfolioService: PortfolioService,
    private portfolioCategoryService: PortfolioCategoryService,
  ) {}

  readonly MAX_PHOTOS = 20;

  categories = signal<PortfolioCategoryView[]>([]);
  selectedCategory = signal<PortfolioCategoryView | null>(null);

  dropdownOpen = signal(false);
  showAddForm = signal(false);

  newCategoryName = signal('');

  editingId = signal<number | null>(null);
  editingName = signal('');

  dragIndex = signal<number | null>(null);

  catDragIndex = signal<number | null>(null);
  catDragOverIndex = signal<number | null>(null);

  private changed = signal(false);

  hasChanges = computed(() => this.changed());

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      categories: this.portfolioCategoryService.getAll(),
      portfolios: this.portfolioService.getAll(),
    }).subscribe({
      next: ({ categories, portfolios }) => {
        const mapped: PortfolioCategoryView[] = categories.map((category) => {
          const portfolio = portfolios.find((p) => p.category_id === category.id);

          return {
            ...category,
            portfolioId: portfolio?.id,
            images:
              portfolio?.image_urls.map((url) => ({
                file: null,
                preview: `http://localhost:${environment.API_PORT}${url}`,
              })) ?? [],
          };
        });

        this.categories.set(mapped);

        if (mapped.length) {
          this.selectedCategory.set(mapped[0]);
        }

        this.changed.set(false);
      },
      error: console.error,
    });
  }

  reloadSettings(): void {
    this.loadData();
  }

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  selectCategory(category: PortfolioCategoryView) {
    this.selectedCategory.set(category);
    this.dropdownOpen.set(false);
  }

  openAddCategory() {
    this.showAddForm.set(true);
    this.newCategoryName.set('');
  }

  confirmAdd() {
    const name = this.newCategoryName().trim();

    if (!name) return;

    this.portfolioCategoryService
      .create({
        name,
        order_index: this.categories().length + 1,
      })
      .subscribe({
        next: () => {
          this.showAddForm.set(false);
          this.newCategoryName.set('');
          this.loadData();
        },
      });
  }

  cancelAdd() {
    this.showAddForm.set(false);
    this.newCategoryName.set('');
  }

  startEdit(category: PortfolioCategoryView) {
    this.editingId.set(category.id);
    this.editingName.set(category.name);
  }

  confirmEdit(category: PortfolioCategoryView) {
    const name = this.editingName().trim();

    if (!name) return;

    this.categories.update((cats) =>
      cats.map((c) =>
        c.id === category.id
          ? {
              ...c,
              name,
            }
          : c,
      ),
    );

    if (this.selectedCategory()?.id === category.id) {
      this.selectedCategory.update((cat) =>
        cat
          ? {
              ...cat,
              name,
            }
          : null,
      );
    }

    this.editingId.set(null);
    this.editingName.set('');

    this.changed.set(true);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editingName.set('');
  }

  deleteCategory(index: number) {
    const category = this.categories()[index];

    if (!category) return;

    this.portfolioCategoryService.delete(category.id).subscribe({
      next: () => this.loadData(),
      error: console.error,
    });
  }

  removePhoto(index: number) {
    const category = this.selectedCategory();

    if (!category) return;

    category.images.splice(index, 1);

    this.categories.update((cats) => [...cats]);

    this.changed.set(true);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const category = this.selectedCategory();

    if (!category) return;

    Array.from(input.files).forEach((file) => {
      category.images.push({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      });
    });

    this.categories.update((cats) => [...cats]);

    this.changed.set(true);

    input.value = '';
  }

  onDragStart(index: number) {
    this.dragIndex.set(index);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(index: number) {
    const source = this.dragIndex();

    if (source === null) return;

    const category = this.selectedCategory();

    if (!category) return;

    const images = [...category.images];

    const [item] = images.splice(source, 1);

    images.splice(index, 0, item);

    category.images = images;

    this.categories.update((cats) => [...cats]);

    this.dragIndex.set(null);

    this.changed.set(true);
  }

  onDragEnd() {
    this.dragIndex.set(null);
  }

  onCatDragStart(index: number) {
    this.catDragIndex.set(index);
  }

  onCatDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.catDragOverIndex.set(index);
  }

  onCatDrop(index: number) {
    const source = this.catDragIndex();

    if (source === null) return;

    const categories = [...this.categories()];

    const [item] = categories.splice(source, 1);

    categories.splice(index, 0, item);

    categories.forEach((cat, i) => {
      cat.order_index = i + 1;
    });

    this.categories.set(categories);

    this.catDragIndex.set(null);
    this.catDragOverIndex.set(null);

    this.changed.set(true);
  }

  onCatDragEnd() {
    this.catDragIndex.set(null);
    this.catDragOverIndex.set(null);
  }

  saveChanges() {
    const categoryRequests = this.categories().map((category) =>
      this.portfolioCategoryService.update(category.id, {
        name: category.name,
        order_index: category.order_index,
      }),
    );

    const selected = this.selectedCategory();

    if (!selected) return;

    const files = selected.images.filter((img) => img.file).map((img) => img.file as File);

    const existingImages = selected.images
      .filter((img) => !img.file)
      .map((img) => img.preview.replace(`http://localhost:${environment.API_PORT}`, ''));

    forkJoin([
      ...categoryRequests,
      this.portfolioService.save(selected.portfolioId ?? null, selected.id, existingImages, files),
    ]).subscribe({
      next: () => {
        this.loadData();
      },
      error: console.error,
    });
  }
}
