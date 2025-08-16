'use client';

import { useState, FormEvent, useEffect } from 'react';
import { X, Save, Plus, Clock, Hash, Timer, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import TimePickerModal from './TimePickerModal';
import { useTranslation } from '@/hooks/useTranslation';
import { getIntervalText } from '@/utils/translationHelpers';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  defaultStartTime: string;
  onUpdateDefaultTime: (time: string) => void;
}

const COMMON_INTERVALS = [
  { value: 4 },
  { value: 6 },
  { value: 8 },
  { value: 12 },
  { value: 24 },
];

export default function AddMedicationModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  defaultStartTime,
  onUpdateDefaultTime 
}: AddMedicationModalProps) {
  const { t } = useTranslation();
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t.enterMedicationName);
      return;
    }

    const intervalValue = parseFloat(interval);
    if (!intervalValue || intervalValue <= 0 || intervalValue > 48) {
      toast.error(t.enterValidInterval);
      return;
    }

    const maxDoses = useMaxDoses && maxDosesPerDay ? parseInt(maxDosesPerDay) : undefined;
    if (useMaxDoses && (!maxDoses || maxDoses < 1 || maxDoses > 10)) {
      toast.error(t.enterValidMaxDoses);
      return;
    }

    onAdd(name.trim(), intervalValue, startTime, maxDoses);
    toast.success(`${t.medicationAdded} ${name.trim()} ${t.toSchedule}`);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleCancel}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t.addMedication}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Medication Name */}
            <div>
              <label 
                htmlFor="add-medication-name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t.medicationName}
              </label>
              <input
                id="add-medication-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.medicationNamePlaceholder}
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
                  {t.startTime}
                </label>
                <TimePickerModal
                  value={startTime}
                  onChange={setStartTime}
                  label={t.selectTime}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.whenToTakeFirstDose}
                </p>
              </div>

              {/* Max Doses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Hash className="inline w-4 h-4 mr-1" />
                  {t.maxDosesPerDay}
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
                      {t.limitDailyDoses}
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
                {t.dosingInterval}
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
                    {getIntervalText(option.value, t)}
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
                  {customInterval && interval ? `${t.every} ${interval}h` : t.custom}
                </button>
              </div>
              
              {/* Custom interval input */}
              {customInterval && (
                <div className="mt-2 flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-500">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.every}</span>
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.hours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={!name || !interval}
              className="flex items-center justify-center space-x-2 px-6 py-3
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                       disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600
                       text-white font-medium rounded-xl shadow-lg hover:shadow-xl
                       transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none
                       transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              <span>{t.saveMedication}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}