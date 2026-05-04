import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login as LoginI } from '../../models/login.model'; // Usa o as pra evitar conflito de nomes com a classe Login

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
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
    // Qualquer mudança no formulário irá resetar o estado de erro
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    // Converte os dados do formulário para o formato esperado pela API
    const login: LoginI = {
      email: this.loginForm.get('email')?.value || '',
      senha: this.loginForm.get('password')?.value || '',
      rememberMe: this.loginForm.get('rememberMe')?.value || false,
    };

    this.auth.login(login).subscribe({
      next: (resp: any) => {
        console.log('Login bem-sucedido:', resp);
        this.router.navigate(['/admin']);
      },

      error: () => (this.loginError = true),
    });
  }
}
