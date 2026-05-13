import { Deal, FilterOptions, SortOptions, PaginationOptions, PaginatedResult } from '../types';

// We still keep this helper for simulating delay on stats/id routes until you make APIs for them
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dealService = {
  getDeals: async (
    filters: FilterOptions = {},
    sort?: SortOptions,
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<Deal>> => {
    
    // 1. Fetch real data from your MongoDB API route
    // (We pass 'industry' to the backend as an example of server-side filtering)
    const queryParams = new URLSearchParams();
    if (filters.industry) queryParams.append('industry', filters.industry);
    
    const res = await fetch(`/api/deals?${queryParams.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch deals from MongoDB. Please try again.');
    }
    
    const json = await res.json();
    let result = [...json.data] as Deal[];

    // 2. Client-side filtering for the rest of the criteria
    // (In the future, you can move this logic to your route.ts MongoDB query!)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.companyName.toLowerCase().includes(query) || 
        deal.description.toLowerCase().includes(query)
      );
    }
    
    if (filters.risk) {
      result = result.filter(deal => deal.risk === filters.risk);
    }
    
    if (filters.minRoi !== undefined) {
      result = result.filter(deal => deal.roi >= filters.minRoi!);
    }
    
    if (filters.minAmount !== undefined) {
      result = result.filter(deal => deal.amount >= filters.minAmount!);
    }
    
    if (filters.maxAmount !== undefined) {
      result = result.filter(deal => deal.amount <= filters.maxAmount!);
    }

    // 3. Client-side Sorting
    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 4. Client-side Pagination
    const total = result.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    
    const paginatedData = result.slice(start, end);
    
    return {
      data: paginatedData,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages
    };
  },

  // Note: These methods still use a local fetch until you create 
  // /api/deals/[id] and /api/stats routes in Next.js!
  getDealById: async (id: string): Promise<Deal | undefined> => {
    // Fallback implementation pointing to your new DB endpoint
    try {
      const res = await fetch(`/api/deals`);
      if (!res.ok) return undefined;
      const json = await res.json();
      const deals: Deal[] = json.data || [];
      return deals.find(deal => deal.id === id);
    } catch (err) {
      return undefined;
    }
  },

  getDealStats: async () => {
    // Fallback implementation pointing to your new DB endpoint
    let deals: Deal[] = [];
    try {
      const res = await fetch(`/api/deals`);
      if (res.ok) {
        const json = await res.json();
        deals = json.data || [];
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }

    const activeDeals = deals.filter(d => d.status === 'Active');
    const totalInvestments = activeDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const avgRoi = activeDeals.reduce((sum, deal) => sum + deal.roi, 0) / (activeDeals.length || 1);
    
    // Growth over time (mocking past 6 months based on random data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const growthData = months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 5000000) + 1000000
    }));

    // Industry distribution
    const industryMap: Record<string, number> = {};
    deals.forEach(deal => {
      industryMap[deal.industry] = (industryMap[deal.industry] || 0) + 1;
    });
    const industryData = Object.entries(industryMap).map(([name, value]) => ({ name, value }));

    // Risk vs ROI mapping
    const riskRoiData = deals.map(deal => ({
      name: deal.companyName,
      riskLevel: deal.risk === 'Low' ? 1 : deal.risk === 'Medium' ? 2 : 3,
      roi: deal.roi,
      amount: deal.amount
    }));

    return {
      totalInvestments,
      activeCount: activeDeals.length,
      avgRoi,
      growthData,
      industryData,
      riskRoiData
    };
  }
};
