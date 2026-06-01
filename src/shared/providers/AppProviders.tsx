import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import { DatabaseProvider } from '@/database/database-provider';
import { queryClient } from '@/lib/react-query';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { FeedbackHost } from '@/shared/ui/feedback/FeedbackHost';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DatabaseProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <FeedbackHost />
        </ThemeProvider>
      </QueryClientProvider>
    </DatabaseProvider>
  );
}
