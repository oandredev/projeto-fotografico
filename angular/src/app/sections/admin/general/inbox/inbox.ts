import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../../core/types/types';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css',
})
export class Inbox {
  search = '';
  currentPage = 1;
  itemsPerPage = 5;
  currentFilter: 'all' | 'starred' | 'archived' = 'all';

  messages: Message[] = [
    {
      id: 1,
      name: 'Ana Oliveira',
      phone: '(11) 98123-4567',
      email: 'ana.oliveira@empresa.com',
      subject: 'Dúvida sobre orçamento',
      body: 'Gostaria de saber mais detalhes...',
      date: '10/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      phone: '(21) 97722-1133',
      email: 'carlos.mendes@gmail.com',
      subject: 'Agendamento de visita',
      body: 'Poderíamos marcar a visita...',
      date: '11/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 3,
      name: 'Mariana Costa',
      phone: '(31) 99888-4455',
      email: 'mari.costa@outlook.com',
      subject: 'Feedback do projeto',
      body: 'O design ficou excelente!',
      date: '12/05/2026',
      isStarred: true,
      isArchived: false,
    },
    {
      id: 4,
      name: 'Ricardo Santos',
      phone: '(11) 94455-6677',
      email: 'ricardo.santos@tech.io',
      subject: 'Atualização de sistema',
      body: 'Informamos que o sistema...',
      date: '12/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 5,
      name: 'Juliana Paiva',
      phone: '(41) 99111-2233',
      email: 'ju.paiva@uol.com.br',
      subject: 'Convite para Workshop',
      body: 'Olá! Você foi convidado...',
      date: '13/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 6,
      name: 'Fernando Lima',
      phone: '(19) 98877-0099',
      email: 'fernando.lima@freelance.com',
      subject: 'Envio de portfólio',
      body: 'Segue em anexo...',
      date: '13/05/2026',
      isStarred: false,
      isArchived: true,
    },
    {
      id: 7,
      name: 'Patrícia Souza',
      phone: '(85) 98765-4321',
      email: 'patricia.souza@gmail.com',
      subject: 'Problema com acesso',
      body: 'Não estou conseguindo...',
      date: '13/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 8,
      name: 'Lucas Ferreira',
      phone: '(11) 91234-5678',
      email: 'lucas.f@servicos.com',
      subject: 'Comprovante de pagamento',
      body: 'Segue o comprovante...',
      date: '14/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 9,
      name: 'Beatriz Rocha',
      phone: '(21) 93344-5566',
      email: 'bearocha@design.com',
      subject: 'Novos mockups',
      body: 'As telas do aplicativo...',
      date: '14/05/2026',
      isStarred: true,
      isArchived: false,
    },
    {
      id: 10,
      name: 'André Martins',
      phone: '(31) 92233-4455',
      email: 'andre.martins@banco.com',
      subject: 'Confirmação de dados',
      body: 'Poderia confirmar...',
      date: '14/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 11,
      name: 'Camila Duarte',
      phone: '(51) 99900-1122',
      email: 'camila.d@escola.edu',
      subject: 'Inscrição confirmada',
      body: 'Sua inscrição...',
      date: '15/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 12,
      name: 'Gustavo Henrique',
      phone: '(11) 97788-9900',
      email: 'g.henrique@logistica.com',
      subject: 'Aviso de entrega',
      body: 'Sua encomenda saiu...',
      date: '15/05/2026',
      isStarred: false,
      isArchived: false,
    },
    {
      id: 13,
      name: 'Sônia Abrão',
      phone: '(11) 96655-4433',
      email: 'sonia@midia.com.br',
      subject: 'Solicitação de entrevista',
      body: 'Gostaríamos de agendar...',
      date: '15/05/2026',
      isStarred: false,
      isArchived: true,
    },
  ];

  setFilter(filter: 'all' | 'starred' | 'archived') {
    this.currentFilter = filter;
    this.currentPage = 1;
  }

  toggleStar(message: Message) {
    message.isStarred = !message.isStarred;
    this.validatePage();
  }

  toggleArchive(message: Message) {
    message.isArchived = !message.isArchived;
    this.validatePage();
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
