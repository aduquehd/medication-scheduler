import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Medication colors - backgrounds
    'bg-blue-600',
    'bg-emerald-600',
    'bg-violet-600',
    'bg-rose-600',
    'bg-teal-600',
    'bg-indigo-600',
    'bg-cyan-600',
    'bg-orange-600',
    // Medication colors - text
    'text-blue-600',
    'text-emerald-600',
    'text-violet-600',
    'text-rose-600',
    'text-teal-600',
    'text-indigo-600',
    'text-cyan-600',
    'text-orange-600',
    // Dark mode variants
    'dark:text-blue-400',
    'dark:text-emerald-400',
    'dark:text-violet-400',
    'dark:text-rose-400',
    'dark:text-teal-400',
    'dark:text-indigo-400',
    'dark:text-cyan-400',
    'dark:text-orange-400',
    // Ring colors for highlights
    'ring-slate-300',
    'dark:ring-slate-600',
    'ring-offset-1',
    'dark:ring-offset-slate-800',
    'ring-2',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}

export default config