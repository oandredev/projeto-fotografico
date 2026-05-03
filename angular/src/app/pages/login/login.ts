import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
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

  onSubmit() {
    this.loginError = true;

    if (this.loginForm.valid) {
      console.log('Request feito:', this.loginForm.value);
    }
  }
}
