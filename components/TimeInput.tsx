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
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="time"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            block w-full pl-10 pr-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${!isValid || error
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950'
              : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
            }
            dark:text-white
          `}
          aria-label={label}
          aria-invalid={!isValid || !!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
      </div>
      {(error || (!isValid && localValue)) && (
        <p id={`${label}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error || 'Please enter a valid time in HH:MM format'}
        </p>
      )}
    </div>
  );
}