export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  IN_PROGRESS = "IN_PROGRESS",
  WON = "WON",
  LOST = "LOST",
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  value?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadComment {
  id: string;
  leadId: string;
  text: string;
  createdAt: string;
}


export type GetLeadsParams = {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  q?: string;
  sort?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
};

export type PaginatedLeads = {
  items: Lead[];
  total: number;
  page?: number;
  limit?: number
};