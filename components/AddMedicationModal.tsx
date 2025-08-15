'use client';

import { useState, FormEvent, useEffect } from 'react';
import { X, Save, Plus, Clock, Hash, Timer, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import TimeInput from './TimeInput';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  defaultStartTime: string;
  onUpdateDefaultTime: (time: string) => void;
}

const COMMON_INTERVALS = [
  { label: 'Every 4 hours', value: 4 },
  { label: 'Every 6 hours', value: 6 },
  { label: 'Every 8 hours', value: 8 },
  { label: 'Every 12 hours', value: 12 },
  { label: 'Once daily', value: 24 },
];

export default function AddMedicationModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  defaultStartTime,
  onUpdateDefaultTime 
}: AddMedicationModalProps) {
  const [name, setName] = useState('');
  const [interval, setInterval] = useState('');
  const [customInterval, setCustomInterval] = useState(false);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [maxDosesPerDay, setMaxDosesPerDay] = useState('');
  const [useMaxDoses, setUseMaxDoses] = useState(false);

  // Update start time when default changes
  useEffect(() => {
    setStartTime(defaultStartTime);
  }, [defaultStartTime]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setInterval('');
    setCustomInterval(false);
    setStartTime(defaultStartTime);
    setMaxDosesPerDay('');
    setUseMaxDoses(false);
  };

  const handleSubmit = (e: FormEvent, addAnother: boolean = false) => {
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
    toast.success(`Added ${name.trim()} to schedule`);
    
    if (addAnother) {
      resetForm();
    } else {
      resetForm();
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add Medication
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6">
          <div className="space-y-4">
            {/* Medication Name */}
            <div>
              <label 
                htmlFor="add-medication-name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Medication Name
              </label>
              <input
                id="add-medication-name"
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
                autoFocus
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Start Time */}
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

              {/* Max Doses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Hash className="inline w-4 h-4 mr-1" />
                  Max Doses Per Day
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="add-use-max-doses"
                      checked={useMaxDoses}
                      onChange={(e) => setUseMaxDoses(e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="add-use-max-doses" className="text-sm text-gray-600 dark:text-gray-400">
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

            {/* Dosing Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Timer className="inline w-4 h-4 mr-1" />
                Dosing Interval
              </label>
              
              {!customInterval ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {COMMON_INTERVALS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setInterval(option.value.toString())}
                        className={`
                          px-3 py-2 rounded-lg border transition-all duration-200
                          ${interval === option.value.toString()
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomInterval(true)}
                    className="w-full text-sm flex items-center justify-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Use custom interval</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
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
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomInterval(false);
                      setInterval('');
                    }}
                    className="text-sm flex items-center justify-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Use common intervals</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={!name || !interval}
              className="flex-1 flex items-center justify-center space-x-2 
                       bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                       disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600
                       text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl
                       transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none
                       transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              <span className="text-base">Save Medication</span>
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any, true)}
                disabled={!name || !interval}
                className="flex items-center justify-center space-x-2 px-4 py-3
                         bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600
                         disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600
                         text-white font-medium rounded-xl shadow-md hover:shadow-lg
                         transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                         text-slate-700 dark:text-slate-300 font-medium rounded-xl
                         transition-all duration-200 hover:shadow-md"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}