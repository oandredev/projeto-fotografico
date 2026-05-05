import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  scrollOrNavigate(sectionId: string) {
    const el = document.getElementById(sectionId);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.router.navigate(['/home'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // pequeno delay pra garantir render
    });
  }
}
