import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Login, TokenResponse } from '../core/types/types';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `http://localhost:${environment.API_PORT}`; // API

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credenciais: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/login`, credenciais).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      }),
    );
  }

  signup(login: Login): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, login);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica expiração do token
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
