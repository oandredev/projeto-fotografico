import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Customer } from '../../../../core/types/types';
import { CustomerService } from '../../../../services/customer/customer';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  constructor(private customerService: CustomerService) {
    this.loadMessages();
  }

  private searchTimeout: any;

  // SIGNALS
  search = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  currentFilter = signal<'all' | 'starred' | 'archived'>('all');
  customers = signal<Customer[]>([]);
  loading = signal(false);
  hasNextPage = signal(false);

  // LOAD
  loadMessages() {
    this.loading.set(true);

    this.customerService.find(this.currentPage(), this.currentFilter(), this.search()).subscribe({
      next: (data) => {
        this.customers.set(data.customers);
        this.hasNextPage.set(data.pagination.hasNextPage);
        this.currentPage.set(data.pagination.currentPage);
        this.totalPages.set(data.pagination.totalPages);

        // Empty
        if (data.customers.length === 0 && this.currentPage() > 1) {
          this.currentPage.update((v) => v - 1);
          this.loadMessages();
          return;
        }

        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
      },
    });
  }

  // FILTER
  setFilter(filter: 'starred' | 'archived' | 'all') {
    if (this.currentFilter() === filter) {
      return;
    }

    this.search.set('');
    this.currentPage.set(1);
    this.currentFilter.set(filter);
    this.loadMessages();
  }

  // SEARCH

  onSearch(value: string) {
    this.search.set(value);
    this.currentPage.set(1);
    this.currentFilter.set('all');

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadMessages();
    }, 300);
  }

  // PAGINATION

  nextPage() {
    if (!this.hasNextPage()) {
      return;
    }

    this.currentPage.update((v) => v + 1);

    this.loadMessages();
  }

  previousPage() {
    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update((v) => v - 1);
    this.loadMessages();
  }

  // STAR

  toggleStar(customer: Customer) {
    const m = {
      ...customer,
      isStarred: !customer.isStarred,
    };

    if (m.id == null) {
      return;
    }

    this.customerService.update(m.id, m).subscribe(() => {
      this.loadMessages();
    });
  }

  // ARCHIVE

  toggleArchive(customer: Customer) {
    const m = {
      ...customer,
      isArchived: !customer.isArchived,
    };

    if (m.id == null) {
      return;
    }

    this.customerService.update(m.id, m).subscribe(() => {
      this.loadMessages();
    });
  }

  // CLEAR

  clearFilters() {
    this.search.set('');
    this.currentFilter.set('all');
    this.currentPage.set(1);
    this.loadMessages();
  }
}
