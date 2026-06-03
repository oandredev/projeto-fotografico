import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PortfolioCategory } from '../../core/types/types';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class PortfolioCategoryService {
  private readonly API = `http://localhost:${environment.API_PORT}/portfolio-category`;

  private http = inject(HttpClient);

  getAll(): Observable<PortfolioCategory[]> {
    return this.http.get<PortfolioCategory[]>(this.API).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<PortfolioCategory> {
    return this.http.get<PortfolioCategory>(`${this.API}/${id}`).pipe(catchError(this.handleError));
  }

  create(data: Omit<PortfolioCategory, 'id' | 'images'>): Observable<String> {
    return this.http.post<String>(this.API, data).pipe(catchError(this.handleError));
  }

  update(id: number, data: Partial<Omit<PortfolioCategory, 'id' | 'images'>>): Observable<String> {
    return this.http.put<String>(`${this.API}/${id}`, data).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<String> {
    return this.http.delete<String>(`${this.API}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(response: HttpErrorResponse): Observable<never> {
    const message = response.error?.error ?? response.message ?? 'Unexpected error';
    const err = new Error(message) as Error & { status: number };
    err.status = response.status;
    return throwError(() => err);
  }
}
