import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={clsx(
        styles.button, 
        styles[variant], 
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
