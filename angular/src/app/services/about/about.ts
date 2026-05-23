import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { About } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly API = `http://localhost:${environment.API_PORT}/about`;

  constructor(private http: HttpClient) {}

  find(): Observable<About> {
    return this.http.get<About>(this.API);
  }

  save(about: About, image: File | null): Observable<any> {
    const formData = new FormData();

    formData.append('presentationText', about.presentationText);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put(`${this.API}/1`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
