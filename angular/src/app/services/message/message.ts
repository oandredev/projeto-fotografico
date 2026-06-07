import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedMessages, Message } from '../../core/types/types';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly API = `http://localhost:${environment.API_PORT}/message`;

  constructor(private http: HttpClient) {}

  find(
    page: number = 1,
    category: string = 'all',
    name: string = '',
  ): Observable<PaginatedMessages> {
    let params = new HttpParams().set('page', page.toString()).set('category', category);

    if (name.trim()) {
      params = params.set('name', name);
    }

    return this.http.get<PaginatedMessages>(this.API, { params });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.API}/stats`);
  }

  save(message: Message): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.API, message);
  }

  update(id: number, message: Message): Observable<any> {
    return this.http.put(`${this.API}/${id}`, message);
  }

  findById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.API}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
