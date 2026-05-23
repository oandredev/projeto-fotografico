import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Hero } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly API = `http://localhost:${environment.API_PORT}/hero`;

  constructor(private http: HttpClient) {}

  find(): Observable<Hero> {
    return this.http.get<Hero>(this.API);
  }

  save(hero: Hero, images: File[] = []): Observable<any> {
    const formData = new FormData();

    formData.append('slogan', hero.slogan?.trim() ?? '');
    formData.append('existingImages', JSON.stringify(hero.imageUrls ?? []));

    for (const image of images) {
      formData.append('images', image);
    }

    return this.http.put(`${this.API}/${hero.id}`, formData);
  }
}
