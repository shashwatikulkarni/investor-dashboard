import { ReactNode } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: TableProps) {
  return <thead className={styles.thead}>{children}</thead>;
}

export function TableBody({ children }: TableProps) {
  return <tbody className={styles.tbody}>{children}</tbody>;
}

export function TableRow({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
  return (
    <tr 
      className={styles.tr} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children }: TableProps) {
  return <th className={styles.th}>{children}</th>;
}

export function TableCell({ children }: TableProps) {
  return <td className={styles.td}>{children}</td>;
}
