import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Message } from '../../../../core/types/types';
import { MessageService } from '../../../../services/message/message';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css',
})
export class Inbox {
  constructor(private messageService: MessageService) {
    this.loadMessages();
  }

  private searchTimeout: any;

  // SIGNALS
  search = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  currentFilter = signal<'inbox' | 'all' | 'starred' | 'archived'>('inbox');
  messages = signal<Message[]>([]);
  loading = signal(false);
  hasNextPage = signal(false);

  // LOAD
  loadMessages() {
    this.loading.set(true);

    this.messageService.find(this.currentPage(), this.currentFilter(), this.search()).subscribe({
      next: (dados) => {
        this.messages.set(dados.messages);
        this.hasNextPage.set(dados.pagination.hasNextPage);
        this.currentPage.set(dados.pagination.currentPage);
        this.totalPages.set(dados.pagination.totalPages);

        // Empty
        if (dados.messages.length === 0 && this.currentPage() > 1) {
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
  setFilter(filter: 'inbox' | 'starred' | 'archived' | 'all') {
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

  toggleStar(message: Message) {
    const m = {
      ...message,
      isStarred: !message.isStarred,
    };

    if (m.id == null) {
      return;
    }

    this.messageService.update(m.id, m).subscribe(() => {
      this.loadMessages();
    });
  }

  // ARCHIVE

  toggleArchive(message: Message) {
    const m = {
      ...message,
      isArchived: !message.isArchived,
    };

    if (m.id == null) {
      return;
    }

    this.messageService.update(m.id, m).subscribe(() => {
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
