'use client';

import { TranslationProvider } from '@/hooks/useTranslation';
import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  );
}