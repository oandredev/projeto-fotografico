export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface TokenResponse {
  token: string;
}

//-------------------------------------------------

export interface Pagination {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

//-------------------------------------------------

export interface PaginatedMessages {
  messages: Message[];
  pagination: Pagination;
}

export interface Message {
  id?: number; // By DB
  name: string;
  phone: string;
  email: string;
  subject?: string;
  body: string;
  date?: string; // By DB
  isStarred: boolean;
  isArchived: boolean;
}

//-------------------------------------------------

export interface PaginatedCustomers {
  customers: Customer[];
  pagination: Pagination;
}

export interface Customer {
  id?: number; // By DB
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  isStarred: boolean;
  isArchived: boolean;
  register?: string; // By DB
}

//-------------------------------------------------

export interface About {
  id?: number;
  presentationText: string;
  imageUrl?: string;
  lastUpdate?: string;
}

//-------------------------------------------------

export interface Hero {
  id?: number;
  slogan: string;
  imageUrls: string[];
  lastUpdate?: string;
}

//-------------------------------------------------

export interface PortfolioCategory {
  id: number;
  name: string;
  order_index: number;
  last_update?: string;
}

export interface Portfolio {
  id: number;
  category_id: number;
  image_urls: string[];
  last_update?: string;
}
