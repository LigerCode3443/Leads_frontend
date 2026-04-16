import axios, { AxiosError } from 'axios';
import { Comment, GetLeadsParams, Lead, LeadStatus, PaginatedLeads } from '@/lib/types';

const API_BASE = 
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 
  'http://localhost:5001'; 

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});


export type ApiErrorResponse = {
  message: string;
  status: number;
  data?: any;
};

function handleApiError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const errorResponse: ApiErrorResponse = {
      message: err.response?.data?.message || err.response?.data?.error || err.message || 'API Request failed',
      status: err.response?.status || 500,
      data: err.response?.data,
    };
    throw errorResponse; // Викидаємо об'єкт помилки
  }
  
  throw { message: 'An unexpected error occurred', status: 500 } as ApiErrorResponse;
}


export async function getLeads(params: GetLeadsParams): Promise<PaginatedLeads> {
  try {
    const res = await api.get<PaginatedLeads>('/leads', { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function getLead(id: string): Promise<Lead> {
  try {
    const res = await api.get<Lead>(`/leads/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export type CreateLeadDto = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>> & { name: string };

export async function createLead(dto: CreateLeadDto): Promise<Lead> {
  try {
    const res = await api.post<Lead>('/leads', dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export type UpdateLeadDto = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>;
export async function updateLead(id: string, dto: UpdateLeadDto): Promise<Lead> {
  try {
    const res = await api.patch<Lead>(`/leads/${encodeURIComponent(id)}`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function deleteLead(id: string): Promise<void> {
  try {
    await api.delete(`/leads/${encodeURIComponent(id)}`);
  } catch (err) {
    handleApiError(err);
  }
}

export async function getComments(leadId: string): Promise<Comment[]> {
  try {
    const res = await api.get<Comment[]>(`/comments/${encodeURIComponent(leadId)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}

export async function addComment(leadId: string, dto: { text: string }): Promise<Comment> {
  try {
    const res = await api.post<Comment>(`/comments/creat/${encodeURIComponent(leadId)}`, dto);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
}