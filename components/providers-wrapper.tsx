"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeWrapper } from "./theme-wrapper";

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </SessionProvider>
  );
}
