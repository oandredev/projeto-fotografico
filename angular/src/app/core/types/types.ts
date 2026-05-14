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
