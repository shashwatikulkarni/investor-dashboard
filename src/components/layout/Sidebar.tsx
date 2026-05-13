'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleMobileMenu } from '@/features/user/userSlice';
import { LayoutDashboard, Compass, Briefcase, Building2, User } from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

const navItems = [
  { href: '/investor/dashboard', label: 'Investor Dashboard', icon: LayoutDashboard },
  { href: '/investor/explorer', label: 'Deal Explorer', icon: Compass },
  { href: '/investor/interests', label: 'My Interests', icon: Briefcase },
  { href: '/corporate/dashboard', label: 'Corporate Dashboard', icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.user.isMobileMenuOpen);

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => dispatch(toggleMobileMenu(false))} 
        />
      )}
      <aside className={clsx(styles.sidebar, isMobileMenuOpen && styles.sidebarOpen)}>
        <div className={styles.logo}>
        <div className={styles.logoIcon}></div>
        <span>FinDash</span>
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={clsx(styles.navLink, isActive && styles.active)}
                >
                  <Icon className={styles.navIcon} size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          <User size={20} />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Shashwati Kulkarni</span>
          <span className={styles.userRole}>Premium Investor</span>
        </div>
      </div>
      </aside>
    </>
  );
}
