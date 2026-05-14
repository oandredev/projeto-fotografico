import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.carregarMensagens();
  }

  // No ngOnInit ou ao trocar de filtro
  carregarMensagens() {
    this.messageService.listar(this.currentPage, this.currentFilter).subscribe((dados) => {
      this.messages = dados;
    });
  }

  toggleStar(message: Message) {
    message.isStarred = !message.isStarred;

    // Salva a alteração no Banco de Dados
    this.messageService.alterar(message.id, message).subscribe(() => {
      this.validatePage();
      // Se estiver na aba de favoritados, talvez queira recarregar a lista
      if (this.currentFilter === 'starred') this.carregarMensagens();
    });
  }

  toggleArchive(message: Message) {
    message.isArchived = !message.isArchived;

    // Salva a alteração no Banco de Dados
    this.messageService.alterar(message.id, message).subscribe(() => {
      this.carregarMensagens(); // Recarrega para a mensagem sumir da aba atual se necessário
    });
  }

  //

  search = '';
  currentPage = 1;
  itemsPerPage = 5;
  currentFilter: 'all' | 'starred' | 'archived' = 'all';

  messages: Message[] = [];

  setFilter(filter: 'all' | 'starred' | 'archived') {
    this.currentFilter = filter;
    this.currentPage = 1;
  }

  filteredMessages(): Message[] {
    let filtered = this.messages;

    if (this.currentFilter === 'starred') {
      filtered = filtered.filter((m) => m.isStarred);
    } else if (this.currentFilter === 'archived') {
      filtered = filtered.filter((m) => m.isArchived);
    } else {
      filtered = filtered.filter((m) => !m.isArchived);
    }

    if (this.search.trim()) {
      const value = this.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(value) ||
          m.email.toLowerCase().includes(value) ||
          m.subject?.toLowerCase().includes(value),
      );
    }
    return filtered;
  }

  paginatedMessages(): Message[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMessages().slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    const count = this.filteredMessages().length;
    return Math.ceil(count / this.itemsPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  validatePage() {
    const total = this.totalPages();
    if (this.currentPage > total) {
      this.currentPage = total;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }
}
