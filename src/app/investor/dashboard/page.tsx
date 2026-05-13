'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { GrowthChart, IndustryChart } from '../../../components/charts/DashboardCharts';
import { dealService } from '@/services/dealService';
import { getRecommendedDeals } from '@/services/recommendationEngine';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { TrendingUp, Briefcase, Activity, DollarSign } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recommendedDeals, setRecommendedDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userPrefs = useAppSelector(state => state.user.preferences);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await dealService.getDealStats();
        setStats(data);
        
        // Fetch deals for recommendation engine
        const allDeals = await dealService.getDeals({ limit: 50, page: 1 } as any);
        
        // Use default preferences if none exist
        const defaultPrefs = {
          industries: ['Fintech', 'SaaS', 'AI/ML'],
          riskTolerance: 'Medium' as any,
          minRoi: 10
        };
        
        const recommendations = getRecommendedDeals(allDeals.data, userPrefs || defaultPrefs).slice(0, 3);
        setRecommendedDeals(recommendations);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className={styles.loadingSkeleton}>Loading dashboard data...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Investor Dashboard</h1>
        <p className="page-description">Overview of your investment portfolio and market trends.</p>
      </header>

      <div className={styles.summaryGrid}>
        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>
              <DollarSign size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Total Investments</p>
              <h3 className={styles.summaryValue}>${(stats.totalInvestments / 1000000).toFixed(1)}M</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>
              <Briefcase size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Active Deals</p>
              <h3 className={styles.summaryValue}>{stats.activeCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Average ROI</p>
              <h3 className={styles.summaryValue}>{stats.avgRoi.toFixed(2)}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Activity size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Risk Distribution</p>
              <h3 className={styles.summaryValue}>Balanced</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Investment Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={stats.growthData} />
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <IndustryChart data={stats.industryData} />
          </CardContent>
        </Card>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 className="page-title" style={{ fontSize: '20px', marginBottom: '16px' }}>Recommended for You</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {recommendedDeals.map(deal => (
            <Card key={deal.id} hoverable onClick={() => router.push(`/investor/deal/${deal.id}`)}>
              <CardContent style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>{deal.companyName}</h3>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                    {deal.matchScore}% Match
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {deal.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span><strong style={{ color: 'var(--text-primary)' }}>${(deal.amount / 1000000).toFixed(1)}M</strong> Raise</span>
                  <span><strong style={{ color: 'var(--accent-success)' }}>{deal.roi}%</strong> ROI</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
