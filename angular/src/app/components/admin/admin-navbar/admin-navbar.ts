import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  sair() {
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
      this.router.navigate(['/']);
      return;
    }

    if (confirm('Tem certeza que deseja sair?')) {
      this.auth.logout();
      this.router.navigate(['/']);
    }
  }
}
