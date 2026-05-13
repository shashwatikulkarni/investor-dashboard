'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GrowthChart } from '@/components/charts/DashboardCharts';
import { investorService } from '@/services/investorService';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import styles from './Corporate.module.css';

export default function CorporateDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await investorService.getCorporateStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch corporate stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="page-container"><div className={styles.loadingSkeleton}>Loading corporate data...</div></div>;
  }

  if (!stats) return null;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Corporate Dashboard</h1>
        <p className="page-description">Track your fundraising progress and investor engagement.</p>
      </header>

      <div className={styles.summaryGrid}>
        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>
              <DollarSign size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Total Funding Raised</p>
              <h3 className={styles.summaryValue}>${(stats.totalFundingRaised / 1000000).toFixed(1)}M</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>
              <Users size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Interested Investors</p>
              <h3 className={styles.summaryValue}>{stats.investorCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <p className={styles.summaryLabel}>Conversion Rate</p>
              <h3 className={styles.summaryValue}>{stats.conversionRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Funding Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={stats.trendData.map((d: any) => ({ name: d.name, value: d.funding }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
