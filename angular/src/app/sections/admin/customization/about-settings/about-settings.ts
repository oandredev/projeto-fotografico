import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutService } from '../../../../services/about/about';
import { environment } from '../../../../environment';
import { About } from '../../../../core/types/types';
import { APP_ANIMATIONS } from '../../../../shared/animations/animation';
@Component({
  selector: 'app-about-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about-settings.html',
  styleUrl: './about-settings.css',
  animations: [APP_ANIMATIONS],
})
export class AboutSettings implements OnInit {
  aboutText = signal('');
  imagePreview = signal<string | null>(null);
  selectedImage = signal<File | null>(null);
  isSaving = signal(false);

  originalText = signal('');
  originalImage = signal<string | null>(null);

  readonly MAX_ABOUT_TEXT = 550;

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.loadAbout();
  }

  loadAbout(): void {
    this.aboutService.find().subscribe({
      next: (about) => {
        if (!about) return;

        this.aboutText.set(about.presentationText);
        this.originalText.set(about.presentationText);
        this.selectedImage.set(null);

        if (about.imageUrl) {
          const url = `http://localhost:${environment.API_PORT}${about.imageUrl}`;

          this.imagePreview.set(url);
          this.originalImage.set(url);
        }
      },
      error: (error) => console.error(error),
    });
  }

  onAboutTextChange(value: string) {
    if (value.length > this.MAX_ABOUT_TEXT) {
      value = value.slice(0, this.MAX_ABOUT_TEXT);
    }

    this.aboutText.set(value);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedImage.set(file);
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  saveAboutSettings(): void {
    if (!this.aboutText().trim()) {
      console.error('Presentation text is required');
      return;
    }

    this.isSaving.set(true);

    const about: About = {
      id: 1,
      presentationText: this.aboutText(),
      imageUrl: '',
      lastUpdate: '',
    };

    this.aboutService.save(about, this.selectedImage()).subscribe({
      next: () => {
        this.originalText.set(this.aboutText());
        this.selectedImage.set(null);
        this.loadAbout();
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      },
    });
  }

  hasChanges = computed(() => {
    const textChanged = this.aboutText().trim() !== this.originalText().trim();
    const imageChanged = this.selectedImage() !== null;
    return textChanged || imageChanged;
  });
}
