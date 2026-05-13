import { ReactNode } from 'react';
import styles from './Badge.module.css';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
}
