'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const nextTheme = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (nextTheme.resolvedTheme || nextTheme.theme || 'dark') : 'dark';

  return {
    theme: activeTheme,
    setTheme: (t) => nextTheme.setTheme(t),
    toggleTheme: () => nextTheme.setTheme(activeTheme === 'dark' ? 'light' : 'dark'),
    mounted,
    resolvedTheme: nextTheme.resolvedTheme,
    systemTheme: nextTheme.systemTheme,
  };
}
