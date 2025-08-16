'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Globe2 } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:shadow-md"
      aria-label={`Change language (current: ${language === 'en' ? 'English' : 'Español'})`}
      title={language === 'en' ? 'Switch to Español' : 'Switch to English'}
    >
      <Globe2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}