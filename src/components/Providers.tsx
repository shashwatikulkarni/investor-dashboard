'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { ReactNode, useEffect, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      // document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <Provider store={store}>
      {!mounted ? (
        <div style={{ visibility: 'hidden' }}>{children}</div>
      ) : (
        children
      )}
    </Provider>
  );
}
