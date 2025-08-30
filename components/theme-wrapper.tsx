"use client";

import { ThemeProvider } from "./theme-provider";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="web3-theme">
      {children}
    </ThemeProvider>
  );
}
