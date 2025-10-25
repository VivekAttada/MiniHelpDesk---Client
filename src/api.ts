import axios from 'axios';
import type { Ticket, Comment, TicketCreate, TicketUpdate, CommentCreate, TicketListResponse } from './types';

// Use Vite proxy in development, or environment variable in production
const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE || '/api')
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ticket API
export const ticketApi = {
  list: async (query?: { q?: string; status?: string }): Promise<TicketListResponse> => {
    const response = await api.get<TicketListResponse>('/tickets', { params: query });
    return response.data;
  },

  get: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: TicketCreate): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },

  update: async (id: string, data: TicketUpdate): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};

// Comment API
export const commentApi = {
  list: async (ticketId: string): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  create: async (ticketId: string, data: CommentCreate): Promise<Comment> => {
    const response = await api.post<Comment>(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },
};
