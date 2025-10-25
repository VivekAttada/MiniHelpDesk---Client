export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  reporter: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  author: string;
  body: string;
  ticketId: string;
  createdAt: string;
}

export interface TicketCreate {
  title: string;
  description: string;
  priority: Priority;
  reporter: string;
}

export interface TicketUpdate {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  reporter?: string;
}

export interface CommentCreate {
  author: string;
  body: string;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
}
