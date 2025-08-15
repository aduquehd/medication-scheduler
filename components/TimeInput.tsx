'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { validateTime } from '@/utils/timeCalculations';

interface TimeInputProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  error?: string;
}

export default function TimeInput({ value, onChange, label = 'Time', error }: TimeInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (validateTime(newValue)) {
      setIsValid(true);
      onChange(newValue);
    } else {
      setIsValid(false);
    }
  };

  const handleBlur = () => {
    if (!isValid && localValue) {
      // Try to fix common formatting issues
      const cleaned = localValue.replace(/[^\d:]/g, '');
      const parts = cleaned.split(':');
      
      if (parts.length === 2) {
        const hours = Math.min(23, Math.max(0, parseInt(parts[0]) || 0));
        const minutes = Math.min(59, Math.max(0, parseInt(parts[1]) || 0));
        const fixed = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        setLocalValue(fixed);
        setIsValid(true);
        onChange(fixed);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="time"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            block w-full pl-10 pr-3 py-2.5 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200
            ${!isValid || error
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950/50'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
            }
            text-slate-900 dark:text-white
            placeholder-slate-400 dark:placeholder-slate-500
          `}
          aria-label={label || 'Time'}
          aria-invalid={!isValid || !!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
      </div>
      {(error || (!isValid && localValue)) && (
        <p id={`${label}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error || 'Please enter a valid time in HH:MM format'}
        </p>
      )}
    </div>
  );
}