export interface PaginatedMessages {
  messages: Message[];
  pagination: Pagination;
}

export interface Message {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  body: string;
  date: string;
  isStarred: boolean;
  isArchived: boolean;
}

export interface Pagination {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

//-------------------------------------------------

export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface TokenResponse {
  token: string;
}
