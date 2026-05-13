import investorsData from '../data/mockInvestors.json';
import { Investor } from '../types';

const investors = investorsData as Investor[];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const investorService = {
  getInvestors: async (): Promise<Investor[]> => {
    await delay(Math.floor(Math.random() * 400) + 300);
    return [...investors];
  },

  getInvestorById: async (id: string): Promise<Investor | undefined> => {
    await delay(400);
    return investors.find(inv => inv.id === id);
  },
  
  getCorporateStats: async () => {
    await delay(500);
    // Simulating analytics for Corporate Dashboard
    const totalFundingRaised = Math.floor(Math.random() * 100000000) + 5000000;
    const investorCount = investors.length;
    const conversionRate = (Math.random() * 5 + 2).toFixed(1); // 2% to 7%
    
    // Trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = months.map(month => ({
      name: month,
      funding: Math.floor(Math.random() * 5000000) + 500000,
      visitors: Math.floor(Math.random() * 10000) + 1000
    }));

    return {
      totalFundingRaised,
      investorCount,
      conversionRate,
      trendData
    };
  }
};
