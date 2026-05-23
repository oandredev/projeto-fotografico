import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environment';
import { HeroService } from '../../../../services/hero/hero';
import { Hero } from '../../../../core/types/types';

@Component({
  selector: 'app-hero-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-settings.html',
  styleUrl: './hero-settings.css',
})
export class HeroSettings implements OnInit {
  constructor(private heroService: HeroService) {}

  heroId = signal<number | null>(null);
  slogan = signal('');
  carouselImages = signal<{ file: File | null; preview: string }[]>([]);

  private originalSlogan = '';
  private originalImageCount = 0;
  readonly MAX_IMAGES = 18;

  ngOnInit(): void {
    this.loadHero();
  }

  loadHero(): void {
    this.heroService.find().subscribe({
      next: (hero: Hero) => {
        if (!hero) {
          this.resetForm();
          return;
        }

        this.heroId.set(hero.id ?? null);
        this.slogan.set(hero.slogan ?? '');

        if (hero.imageUrls?.length) {
          const images = hero.imageUrls.map((imageUrl) => ({
            file: null,
            preview: `http://localhost:${environment.API_PORT}${imageUrl}`,
          }));
          this.carouselImages.set(images);
        } else {
          this.carouselImages.set([]);
        }

        this.originalSlogan = hero.slogan ?? '';
        this.originalImageCount = hero.imageUrls?.length ?? 0;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onCarouselImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const current = this.carouselImages().length;
    const available = this.MAX_IMAGES - current;

    if (available <= 0) {
      alert(`Limite de ${this.MAX_IMAGES} imagens atingido.`);
      input.value = '';
      return;
    }

    const files = Array.from(input.files).slice(0, available);

    if (files.length < input.files.length) {
      alert(
        `Apenas ${files.length} imagem(ns) adicionada(s). Limite de ${this.MAX_IMAGES} imagens.`,
      );
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    this.carouselImages.update((images) => [...images, ...newImages]);
    input.value = '';
  }

  removeCarouselImage(index: number): void {
    const image = this.carouselImages()[index];

    if (image?.file && image.preview) {
      URL.revokeObjectURL(image.preview);
    }

    this.carouselImages.update((images) => images.filter((_, i) => i !== index));
  }

  hasChanges(): boolean {
    const sloganChanged = this.slogan().trim() !== this.originalSlogan.trim();
    const hasNewFiles = this.carouselImages().some((img) => img.file !== null);
    const imageCountChanged =
      this.carouselImages().filter((img) => img.file === null).length !== this.originalImageCount;

    return sloganChanged || hasNewFiles || imageCountChanged;
  }

  reloadSettings(): void {
    this.resetPreviewUrls();
    this.loadHero();
  }

  saveSettings(): void {
    console.log('teste');
    const files = this.carouselImages()
      .filter((image) => image.file)
      .map((image) => image.file as File);

    const existingImages = this.carouselImages()
      .filter((image) => !image.file)
      .map((image) => image.preview.replace(`http://localhost:${environment.API_PORT}`, ''));

    const hero: Hero = {
      id: this.heroId() ?? 1,
      slogan: this.slogan().trim(),
      imageUrls: existingImages,
    };

    this.heroService.save(hero, files).subscribe({
      next: () => {
        this.resetPreviewUrls();
        this.loadHero();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private resetForm(): void {
    this.heroId.set(null);
    this.slogan.set('');
    this.carouselImages.set([]);
    this.originalSlogan = '';
    this.originalImageCount = 0;
  }

  private resetPreviewUrls(): void {
    for (const image of this.carouselImages()) {
      if (image.file && image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    }
  }
}
