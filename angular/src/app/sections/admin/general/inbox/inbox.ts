import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  starred: boolean;
  archived: boolean;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css',
})
export class Inbox {
  search = '';

  currentFilter: 'all' | 'starred' | 'archived' = 'all';

  messages: Message[] = [
    {
      id: 1,
      name: 'Bruno Alves',
      phone: '(11) 98123-4567',
      email: 'bruno@gmail.com',
      subject: 'The studio space is now prepared for the final print review.',
      body: 'Proposal for the Architecture of Light monograph...',
      date: '12/04/2026',
      starred: true,
      archived: false,
    },
    {
      id: 2,
      name: 'Maria Clara',
      phone: '(11) 97777-7777',
      email: 'maria@gmail.com',
      subject: 'Atualização do projeto visual',
      body: 'Precisamos revisar os layouts mobile.',
      date: '10/04/2026',
      starred: false,
      archived: true,
    },
  ];

  setFilter(filter: 'all' | 'starred' | 'archived') {
    this.currentFilter = filter;
  }

  toggleStar(message: Message) {
    message.starred = !message.starred;
  }

  toggleArchive(message: Message) {
    message.archived = !message.archived;
  }

  filteredMessages() {
    let filtered = [...this.messages];

    if (this.currentFilter === 'starred') {
      filtered = filtered.filter((m) => m.starred);
    }

    if (this.currentFilter === 'archived') {
      filtered = filtered.filter((m) => m.archived);
    }

    if (this.search.trim()) {
      const value = this.search.toLowerCase();

      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(value) ||
          m.email.toLowerCase().includes(value) ||
          m.subject.toLowerCase().includes(value) ||
          m.body.toLowerCase().includes(value),
      );
    }

    return filtered;
  }
}
