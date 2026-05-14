import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly API = 'http://localhost:3000/mensagem';

  constructor(private http: HttpClient) {}

  listar(pagina: number = 1, filtro: string = 'all'): Observable<Message[]> {
    const params = new HttpParams().set('pagina', pagina.toString()).set('filtro', filtro);

    return this.http.get<Message[]>(this.API, { params });
  }

  salvar(mensagem: Partial<Message>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.API, mensagem);
  }

  alterar(id: number, mensagem: Message): Observable<any> {
    return this.http.put(`${this.API}/${id}`, mensagem);
  }

  buscarPorId(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.API}/${id}`);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
