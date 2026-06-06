import { Component, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-light-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './light-box.html',
  styleUrl: './light-box.css',
})
export class LightBox {
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  isClosing = signal(false);
  images = signal<string[]>([]);
  activeIndex = signal(0);
  categoryName = signal('');
  fading = signal(false);

  activeImage = computed(() => this.images()[this.activeIndex()] ?? '');

  open(images: string[], startIndex: number = 0, categoryName: string = ''): void {
    this.images.set(images);
    this.activeIndex.set(startIndex);
    this.categoryName.set(categoryName);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isOpen.set(false);
      this.isClosing.set(false);
      document.body.style.overflow = '';
    }, 200);
  }

  goTo(index: number): void {
    if (index === this.activeIndex() || this.fading()) return;
    this.triggerFade(() => {
      this.activeIndex.set(index);
      this.scrollThumbIntoView(index);
    });
  }

  prev(): void {
    const prev = (this.activeIndex() - 1 + this.images().length) % this.images().length;
    this.goTo(prev);
  }

  next(): void {
    const next = (this.activeIndex() + 1) % this.images().length;
    this.goTo(next);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'Escape') this.close();
  }

  private triggerFade(callback: () => void): void {
    this.fading.set(true);
    setTimeout(() => {
      callback();
      this.fading.set(false);
    }, 160);
  }

  private scrollThumbIntoView(index: number): void {
    setTimeout(() => {
      const carousel = this.carouselRef?.nativeElement;
      if (!carousel) return;
      const thumb = carousel.querySelectorAll<HTMLElement>('.lb-thumb')[index];
      thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 0);
  }
}
