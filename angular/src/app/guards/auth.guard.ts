import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  // Se não estiver logado:
  alert(
    'Sessão expirada ou usuário não autenticado. Por favor, faça login para acessar esta página.',
  );

  authService.logout();
  return false;
};
