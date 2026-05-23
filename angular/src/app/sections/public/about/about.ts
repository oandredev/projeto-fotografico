import { Component, OnInit, signal } from '@angular/core';
import { AboutService } from '../../../services/about/about';
import { environment } from '../../../environment';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  constructor(private aboutService: AboutService) {}

  aboutText = signal('');
  aboutImage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAbout();
  }

  loadAbout(): void {
    this.aboutService.find().subscribe({
      next: (about) => {
        if (!about) return;

        this.aboutText.set(about.presentationText);

        if (about.imageUrl) {
          const url = `http://localhost:${environment.API_PORT}${about.imageUrl}`;

          this.aboutImage.set(url);
        } else {
          this.aboutImage.set(null);
        }
      },
      error: (error) => console.error(error),
    });
  }
}
