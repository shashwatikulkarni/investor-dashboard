import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fintech Dashboard',
  description: 'Advanced web dashboard for investors and corporates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <Providers>
          <div className={styles.appContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
              <Topbar />
              <main className={styles.pageContent}>
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
