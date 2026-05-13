'use client';

import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setFilters } from '@/features/deals/dealsSlice';
import { toggleMobileMenu } from '@/features/user/userSlice';
import styles from './Topbar.module.css';

export function Topbar() {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      dispatch(setFilters({ searchQuery: searchTerm.trim() }));
      router.push('/investor/explorer');
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className={styles.topbar}>
      <button 
        className={styles.mobileMenuBtn} 
        onClick={() => dispatch(toggleMobileMenu())}
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search deals..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
      </div>
    </header>
  );
}
