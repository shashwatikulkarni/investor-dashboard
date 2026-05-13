'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeals, setFilters, setSort, setPage } from '@/features/deals/dealsSlice';
import { toggleInterest } from '@/features/user/userSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Filter, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import styles from './Explorer.module.css';

export default function DealExplorer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, total, loading, filters, sort, pagination } = useAppSelector(state => state.deals);
  const { interests } = useAppSelector(state => state.user);
  
  const [searchTerm, setSearchTerm] = useState(filters.searchQuery || '');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(setFilters({ ...filters, searchQuery: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [filters, sort, pagination.page, dispatch]);

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ ...filters, industry: e.target.value || undefined }));
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ ...filters, risk: e.target.value || undefined }));
  };

  const handleMinRoiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minRoi = e.target.value ? parseInt(e.target.value, 10) : undefined;
    dispatch(setFilters({ ...filters, minRoi }));
  };

  const handleInvestmentRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let minAmount = undefined;
    let maxAmount = undefined;
    
    if (val === '0-1m') { minAmount = 0; maxAmount = 1000000; }
    else if (val === '1m-3m') { minAmount = 1000000; maxAmount = 3000000; }
    else if (val === '3m+') { minAmount = 3000000; }
    
    dispatch(setFilters({ ...filters, minAmount, maxAmount }));
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) {
      dispatch(setSort(undefined));
      return;
    }
    const [field, direction] = e.target.value.split('-');
    dispatch(setSort({ field: field as any, direction: direction as any }));
  };

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
        <h1 className="page-title">Deal Explorer</h1>
        <p className="page-description">Discover and filter through active investment opportunities.</p>
      </header>

      <div className={styles.controlsSection}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="Search companies or descriptions..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={16} className={styles.filterIcon} />
            <select className={styles.select} onChange={handleIndustryChange} value={filters.industry || ''}>
              <option value="">All Industries</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthtech">Healthtech</option>
              <option value="SaaS">SaaS</option>
              <option value="Web3">Web3</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI/ML">AI/ML</option>
              <option value="E-commerce">E-commerce</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <select className={styles.select} onChange={handleRiskChange} value={filters.risk || ''}>
              <option value="">Any Risk</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <select className={styles.select} onChange={handleMinRoiChange} value={filters.minRoi || ''}>
              <option value="">Any ROI</option>
              <option value="5">&gt; 5%</option>
              <option value="10">&gt; 10%</option>
              <option value="15">&gt; 15%</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <select 
              className={styles.select} 
              onChange={handleInvestmentRangeChange} 
              value={
                filters.minAmount === 0 && filters.maxAmount === 1000000 ? '0-1m' :
                filters.minAmount === 1000000 && filters.maxAmount === 3000000 ? '1m-3m' :
                filters.minAmount === 3000000 ? '3m+' : ''
              }
            >
              <option value="">Any Amount</option>
              <option value="0-1m">&lt; $1M</option>
              <option value="1m-3m">$1M - $3M</option>
              <option value="3m+">&gt; $3M</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <select className={styles.select} onChange={handleSortChange} value={sort ? `${String(sort.field)}-${sort.direction}` : ''}>
              <option value="">Sort By (Default)</option>
              <option value="roi-desc">Highest ROI</option>
              <option value="roi-asc">Lowest ROI</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.dealsGrid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className={styles.skeletonCard}>
              <CardContent className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} style={{ width: '60%' }} />
              </CardContent>
            </Card>
          ))
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No deals found matching your criteria.</p>
            <Button variant="outline" onClick={() => dispatch(setFilters({}))}>Clear Filters</Button>
          </div>
        ) : (
          items.map(deal => (
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
                    aria-label={interests.includes(deal.id) ? "Remove from interests" : "Add to interests"}
                  >
                    <Heart 
                      size={20} 
                      fill={interests.includes(deal.id) ? "var(--accent-danger)" : "transparent"} 
                      color={interests.includes(deal.id) ? "var(--accent-danger)" : "var(--text-secondary)"} 
                    />
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

      {!loading && total > 0 && (
        <div className={styles.pagination}>
          <Button 
            variant="outline" 
            disabled={pagination.page === 1}
            onClick={() => dispatch(setPage(pagination.page - 1))}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {Math.ceil(total / pagination.limit)}
          </span>
          <Button 
            variant="outline" 
            disabled={pagination.page >= Math.ceil(total / pagination.limit)}
            onClick={() => dispatch(setPage(pagination.page + 1))}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
