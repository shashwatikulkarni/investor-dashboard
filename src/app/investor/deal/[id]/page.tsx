'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addInvestment, addNotification } from '@/features/user/userSlice';
import { dealService } from '@/services/dealService';
import { Deal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GrowthChart } from '@/components/charts/DashboardCharts';
import { ArrowLeft, Building, Target, ShieldAlert, TrendingUp, Users, DollarSign } from 'lucide-react';
import styles from './DealDetails.module.css';
import { clsx } from 'clsx';

export default function DealDetails() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { investments } = useAppSelector((state) => state.user);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const isInvested = typeof id === 'string' && investments.includes(id);

  const handleInvest = () => {
    if (typeof id === 'string' && !isInvested) {
      dispatch(addInvestment(id));
      dispatch(addNotification(`You successfully invested in ${deal?.companyName || 'this deal'}.`));
      alert(`Successfully invested in ${deal?.companyName}!`);
    }
  };

  const handleDownload = () => {
    alert(`Downloading Pitch Deck for ${deal?.companyName}...`);
  };

  useEffect(() => {
    async function fetchDeal() {
      if (typeof id !== 'string') return;
      try {
        const data = await dealService.getDealById(id);
        if (data) setDeal(data);
      } catch (err) {
        console.error('Failed to fetch deal details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeal();
  }, [id]);

  if (loading) {
    return <div className="page-container"><div className={styles.loading}>Loading deal details...</div></div>;
  }

  if (!deal) {
    return (
      <div className="page-container">
        <div className={styles.error}>
          <h2>Deal not found</h2>
          <Button onClick={() => router.push('/investor/explorer')}>Back to Explorer</Button>
        </div>
      </div>
    );
  }

  // Mock projection data
  const projectionData = [
    { name: 'Year 1', value: deal.amount * 1.2 },
    { name: 'Year 2', value: deal.amount * 1.5 },
    { name: 'Year 3', value: deal.amount * 2.1 },
    { name: 'Year 4', value: deal.amount * 3.0 },
    { name: 'Year 5', value: deal.amount * 4.5 }
  ];

  return (
    <div className="page-container">
      <button className={styles.backButton} onClick={() => router.push('/investor/explorer')}>
        <ArrowLeft size={16} /> Back to Explorer
      </button>

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.companyIcon}>
            <Building size={32} />
          </div>
          <div>
            <h1 className={styles.companyName}>{deal.companyName}</h1>
            <div className={styles.tags}>
              <Badge variant="primary">{deal.industry}</Badge>
              <Badge variant={deal.status === 'Active' ? 'success' : 'default'}>{deal.status}</Badge>
            </div>
          </div>
        </div>
        <div className={styles.actionSection}>
          <Button variant="outline" onClick={handleDownload}>Download Pitch Deck</Button>
          <Button 
            onClick={handleInvest} 
            disabled={isInvested}
            style={{ opacity: isInvested ? 0.7 : 1, cursor: isInvested ? 'not-allowed' : 'pointer' }}
          >
            {isInvested ? 'Invested ✓' : 'Invest Now'}
          </Button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={clsx(styles.tab, activeTab === 'overview' && styles.activeTab)}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={clsx(styles.tab, activeTab === 'financials' && styles.activeTab)}
          onClick={() => setActiveTab('financials')}
        >
          Financials
        </button>
        <button 
          className={clsx(styles.tab, activeTab === 'risk' && styles.activeTab)}
          onClick={() => setActiveTab('risk')}
        >
          Risk Analysis
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.mainColumn}>
              <Card>
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={styles.descriptionText}>{deal.description}</p>
                  <p className={styles.descriptionText}>
                    Founded in {new Date(deal.createdAt).getFullYear()}, the company has shown exceptional growth
                    and product-market fit. They are raising funds to expand their operations globally.
                  </p>
                </CardContent>
              </Card>

              <Card className={styles.metricsCard}>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <DollarSign size={20} className={styles.metricIcon} />
                    <span className={styles.metricLabel}>Monthly Revenue</span>
                    <span className={styles.metricValue}>${(deal.metrics.revenue / 1000).toFixed(1)}k</span>
                  </div>
                  <div className={styles.metricBox}>
                    <TrendingUp size={20} className={styles.metricIcon} />
                    <span className={styles.metricLabel}>Burn Rate</span>
                    <span className={styles.metricValue}>${(deal.metrics.burnRate / 1000).toFixed(1)}k/mo</span>
                  </div>
                  <div className={styles.metricBox}>
                    <Users size={20} className={styles.metricIcon} />
                    <span className={styles.metricLabel}>Active Users</span>
                    <span className={styles.metricValue}>{deal.metrics.users.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className={styles.sideColumn}>
              <Card>
                <CardHeader>
                  <CardTitle>Investment Highlights</CardTitle>
                </CardHeader>
                <CardContent className={styles.highlightsList}>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Target Raise</span>
                    <span className={styles.highlightValue}>${(deal.amount / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Projected ROI</span>
                    <span className={styles.highlightValue} style={{ color: 'var(--accent-success)' }}>{deal.roi}%</span>
                  </div>
                  <div className={styles.highlightItem}>
                    <span className={styles.highlightLabel}>Risk Assessment</span>
                    <Badge variant={deal.risk === 'High' ? 'danger' : deal.risk === 'Medium' ? 'warning' : 'success'}>
                      {deal.risk}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <Card>
            <CardHeader>
              <CardTitle>5-Year Revenue Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <GrowthChart data={projectionData} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'risk' && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors & Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.riskAlert}>
                <ShieldAlert size={24} className={deal.risk === 'High' ? styles.iconDanger : styles.iconWarning} />
                <div>
                  <h4 className={styles.riskTitle}>Overall Risk Rating: {deal.risk}</h4>
                  <p className={styles.riskText}>
                    Based on market conditions, regulatory environment, and company execution history.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
