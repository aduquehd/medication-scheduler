'use client';

import { useState, FormEvent } from 'react';
import { Plus, Clock, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import TimeInput from './TimeInput';

interface MedicationFormProps {
  onAdd: (name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  defaultStartTime: string;
}

const COMMON_INTERVALS = [
  { label: 'Every 4 hours', value: 4 },
  { label: 'Every 6 hours', value: 6 },
  { label: 'Every 8 hours', value: 8 },
  { label: 'Every 12 hours', value: 12 },
  { label: 'Once daily', value: 24 },
];

export default function MedicationForm({ onAdd, defaultStartTime }: MedicationFormProps) {
  const [name, setName] = useState('');
  const [interval, setInterval] = useState('');
  const [customInterval, setCustomInterval] = useState(false);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [maxDosesPerDay, setMaxDosesPerDay] = useState('');
  const [useMaxDoses, setUseMaxDoses] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a medication name');
      return;
    }

    const intervalValue = parseFloat(interval);
    if (!intervalValue || intervalValue <= 0 || intervalValue > 48) {
      toast.error('Please enter a valid interval between 0 and 48 hours');
      return;
    }

    const maxDoses = useMaxDoses && maxDosesPerDay ? parseInt(maxDosesPerDay) : undefined;
    if (useMaxDoses && (!maxDoses || maxDoses < 1 || maxDoses > 10)) {
      toast.error('Please enter a valid max doses between 1 and 10');
      return;
    }

    onAdd(name.trim(), intervalValue, startTime, maxDoses);
    toast.success(`Added ${name.trim()} to your schedule`);
    
    // Reset form
    setName('');
    setInterval('');
    setCustomInterval(false);
    setStartTime(defaultStartTime);
    setMaxDosesPerDay('');
    setUseMaxDoses(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-200 border border-slate-100 dark:border-slate-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Add Medication
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="medication-name" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Medication Name
          </label>
          <input
            id="medication-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Aspirin, Ibuprofen"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                     placeholder-slate-400 dark:placeholder-slate-500
                     transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            aria-label="Medication name"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Start Time
            </label>
            <TimeInput
              value={startTime}
              onChange={setStartTime}
              label=""
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              When to take the first dose
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="inline w-4 h-4 mr-1" />
              Max Doses Per Day
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="use-max-doses"
                  checked={useMaxDoses}
                  onChange={(e) => setUseMaxDoses(e.target.checked)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="use-max-doses" className="text-sm text-gray-600 dark:text-gray-400">
                  Limit daily doses
                </label>
              </div>
              {useMaxDoses && (
                <input
                  type="number"
                  value={maxDosesPerDay}
                  onChange={(e) => setMaxDosesPerDay(e.target.value)}
                  placeholder="e.g., 3"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                           transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  aria-label="Maximum doses per day"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dosing Interval
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            {COMMON_INTERVALS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setInterval(option.value.toString());
                  setCustomInterval(false);
                }}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-200
                  ${interval === option.value.toString() && !customInterval
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
            
            {/* Custom interval option */}
            <button
              type="button"
              onClick={() => {
                setCustomInterval(true);
                if (!interval || COMMON_INTERVALS.some(opt => opt.value.toString() === interval)) {
                  setInterval('');
                }
              }}
              className={`
                px-3 py-2 rounded-lg border transition-all duration-200
                ${customInterval
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm'
                }
              `}
            >
              {customInterval && interval ? `Every ${interval}h` : 'Custom'}
            </button>
          </div>
          
          {/* Custom interval input */}
          {customInterval && (
            <div className="mt-2 flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-500">
              <span className="text-sm text-gray-600 dark:text-gray-400">Every</span>
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="6"
                step="0.5"
                min="0.5"
                max="48"
                className="w-20 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                         transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                aria-label="Interval hours"
                autoFocus
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!name || !interval}
          className="w-full flex items-center justify-center space-x-2 
                   bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                   disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600
                   text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg
                   transition-all duration-200 transform hover:scale-[1.02]
                   disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </form>
    </div>
  );
}