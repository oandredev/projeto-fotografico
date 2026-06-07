import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environment';
import { Portfolio, PortfolioStats } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly API = `http://localhost:${environment.API_PORT}/portfolio`;

  private http = inject(HttpClient);

  getAll(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.API).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.API}/${id}`).pipe(catchError(this.handleError));
  }

  save(
    portfolioId: number | null,
    categoryId: number,
    existingImages: string[],
    files: File[],
  ): Observable<any> {
    const formData = new FormData();

    formData.append('category_id', categoryId.toString());
    formData.append('existingImages', JSON.stringify(existingImages));

    files.forEach((file) => {
      formData.append('images', file);
    });

    if (portfolioId) {
      return this.http
        .put(`${this.API}/${portfolioId}`, formData)
        .pipe(catchError(this.handleError));
    }

    return this.http.post(this.API, formData).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`).pipe(catchError(this.handleError));
  }

  getStats(): Observable<PortfolioStats> {
    return this.http.get<PortfolioStats>(`${this.API}/stats`).pipe(catchError(this.handleError));
  }

  private handleError(response: HttpErrorResponse): Observable<never> {
    const message = response.error?.error ?? response.message ?? 'Unexpected error';
    const err = new Error(message) as Error & {
      status: number;
    };
    err.status = response.status;

    return throwError(() => err);
  }
}
