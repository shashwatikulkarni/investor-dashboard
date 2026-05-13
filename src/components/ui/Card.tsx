import { ReactNode } from 'react';
import styles from './Card.module.css';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, style, onClick, hoverable }: CardProps) {
  return (
    <div 
      className={clsx(
        styles.card, 
        hoverable && styles.hoverable,
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={clsx(styles.header, className)} style={style}>{children}</div>;
}

export function CardTitle({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return <h3 className={clsx(styles.title, className)} style={style}>{children}</h3>;
}

export function CardContent({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return <div className={clsx(styles.content, className)} style={style}>{children}</div>;
}
