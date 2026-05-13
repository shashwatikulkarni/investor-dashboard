import { ReactNode } from 'react';
import styles from './Card.module.css';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div 
      className={clsx(
        styles.card, 
        hoverable && styles.hoverable,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={clsx(styles.header, className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode, className?: string }) {
  return <h3 className={clsx(styles.title, className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={clsx(styles.content, className)}>{children}</div>;
}
