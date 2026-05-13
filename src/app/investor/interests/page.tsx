'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { dealService } from '@/services/dealService';
import { toggleInterest } from '@/features/user/userSlice';
import { Deal } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import styles from '../explorer/Explorer.module.css';

export default function MyInterests() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { interests } = useAppSelector(state => state.user);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterestedDeals() {
      setLoading(true);
      try {
        // Fetch all and filter, or make multiple API calls. Since it's simulated, fetching all is fine.
        const response = await dealService.getDeals({ limit: 1000, page: 1 } as any);
        const interestedDeals = response.data.filter(d => interests.includes(d.id));
        setDeals(interestedDeals);
      } catch (err) {
        console.error('Failed to fetch interested deals', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInterestedDeals();
  }, [interests]);

  const handleDealClick = (id: string) => {
    router.push(`/investor/deal/${id}`);
  };

  const handleToggleInterest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(toggleInterest(id));
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch(risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">My Interests</h1>
        <p className="page-description">Manage deals you've bookmarked for later review.</p>
      </header>

      <div className={styles.dealsGrid}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className={styles.skeletonCard}>
              <CardContent className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
              </CardContent>
            </Card>
          ))
        ) : deals.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't added any deals to your interests yet.</p>
            <Button onClick={() => router.push('/investor/explorer')}>Explore Deals</Button>
          </div>
        ) : (
          deals.map(deal => (
            <Card key={deal.id} hoverable onClick={() => handleDealClick(deal.id)} className={styles.dealCard}>
              <CardContent className={styles.dealCardContent}>
                <div className={styles.dealHeader}>
                  <div>
                    <h3 className={styles.companyName}>{deal.companyName}</h3>
                    <Badge variant="primary">{deal.industry}</Badge>
                  </div>
                  <button 
                    className={styles.interestBtn}
                    onClick={(e) => handleToggleInterest(e, deal.id)}
                  >
                    <Heart size={20} fill="var(--accent-danger)" color="var(--accent-danger)" />
                  </button>
                </div>
                
                <p className={styles.description}>{deal.description}</p>
                
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Target Raise</span>
                    <span className={styles.metricValue}>${(deal.amount / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Proj. ROI</span>
                    <span className={styles.metricValue} style={{ color: 'var(--accent-success)' }}>{deal.roi}%</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Risk</span>
                    <Badge variant={getRiskBadgeVariant(deal.risk) as any}>{deal.risk}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
