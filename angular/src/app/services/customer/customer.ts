import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedCustomers, Customer } from '../../core/types/types';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API = `http://localhost:${environment.API_PORT}/customer`;

  constructor(private http: HttpClient) {}

  find(
    page: number = 1,
    category: string = 'all',
    name: string = '',
  ): Observable<PaginatedCustomers> {
    let params = new HttpParams().set('page', page.toString()).set('category', category);

    if (name.trim()) {
      params = params.set('name', name);
    }

    return this.http.get<PaginatedCustomers>(this.API, { params });
  }

  save(customer: Customer): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.API, this.formatCustomer(customer));
  }

  update(id: number, customer: Customer): Observable<any> {
    return this.http.put(`${this.API}/${id}`, this.formatCustomer(customer));
  }

  findById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  // Util

  formatCustomer(customer: Customer): Customer {
    return {
      ...customer,
      birthDate: new Date(customer.birthDate).toISOString().split('T')[0],
    };
  }
}
