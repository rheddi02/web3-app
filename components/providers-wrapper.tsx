"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeWrapper } from "./theme-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </SessionProvider>
    </QueryClientProvider>
  );
}
