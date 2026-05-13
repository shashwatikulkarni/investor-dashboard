export interface DealMetrics {
  revenue: number;
  burnRate: number;
  users: number;
}

export interface Deal {
  id: string;
  companyName: string;
  description: string;
  industry: string;
  amount: number;
  roi: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Closed' | 'Pending' | 'In Review';
  createdAt: string;
  metrics: DealMetrics;
}

export interface InvestorPreferences {
  industries: string[];
  riskTolerance: 'Low' | 'Medium' | 'High';
  minRoi: number;
}

export interface Investor {
  id: string;
  name: string;
  type: 'Corporate' | 'Individual';
  totalInvested: number;
  activeDeals: number;
  preferences: InvestorPreferences;
}

export interface FilterOptions {
  industry?: string;
  risk?: string;
  minRoi?: number;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface SortOptions {
  field: keyof Deal;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
