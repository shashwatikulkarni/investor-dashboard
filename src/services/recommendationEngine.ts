import { Deal, InvestorPreferences } from '../types';

/**
 * Calculates a match score (0-100) for a given deal based on investor preferences.
 */
export const calculateMatchScore = (deal: Deal, preferences: InvestorPreferences): number => {
  let score = 0;

  // 1. Industry Match (Max 40 points)
  if (preferences.industries.includes(deal.industry)) {
    score += 40;
  }

  // 2. Risk Match (Max 30 points)
  const riskLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const dealRisk = riskLevels[deal.risk];
  const prefRisk = riskLevels[preferences.riskTolerance];
  
  if (dealRisk === prefRisk) {
    score += 30; // Exact match
  } else if (Math.abs(dealRisk - prefRisk) === 1) {
    score += 15; // Partial match
  }

  // 3. ROI Attractiveness (Max 30 points)
  if (deal.roi >= preferences.minRoi + 5) {
    score += 30; // Very attractive
  } else if (deal.roi >= preferences.minRoi) {
    score += 20; // Meets minimum
  } else if (deal.roi >= preferences.minRoi - 2) {
    score += 10; // Slightly below
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Sorts and ranks deals based on the match score with given preferences.
 */
export const getRecommendedDeals = (deals: Deal[], preferences: InvestorPreferences): (Deal & { matchScore: number })[] => {
  const scoredDeals = deals.map(deal => ({
    ...deal,
    matchScore: calculateMatchScore(deal, preferences)
  }));

  // Sort by score descending
  return scoredDeals.sort((a, b) => b.matchScore - a.matchScore);
};
