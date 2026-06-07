import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Login as LoginI } from '../../core/types/types';
import { APP_ANIMATIONS } from '../../shared/animations/animation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  animations: APP_ANIMATIONS,
})
export class Login {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  loginError: boolean = false;

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = false;
      }
    });

    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const login: LoginI = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || '',
      rememberMe: this.loginForm.get('rememberMe')?.value || false,
    };

    this.auth.login(login).subscribe({
      next: (resp: any) => {
        console.log('Login sucessfully:', resp);
        this.router.navigate(['/admin']);
      },
      error: () => (this.loginError = true),
    });
  }
}
