'use client';

import { useState, FormEvent, useEffect } from 'react';
import { X, Save, Clock, Hash, Trash2, Timer, RefreshCw, Pill } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getIntervalText } from '@/utils/translationHelpers';
import toast from 'react-hot-toast';
import TimeInput from './TimeInput';
import { Medication } from '@/types/medication';

interface EditMedicationModalProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  onDelete?: (id: string) => void;
}

const COMMON_INTERVALS = [
  { label: 'Every 4 hours', value: 4 },
  { label: 'Every 6 hours', value: 6 },
  { label: 'Every 8 hours', value: 8 },
  { label: 'Every 12 hours', value: 12 },
  { label: 'Once daily', value: 24 },
];

export default function EditMedicationModal({ medication, isOpen, onClose, onUpdate, onDelete }: EditMedicationModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [interval, setInterval] = useState('');
  const [customInterval, setCustomInterval] = useState(false);
  const [startTime, setStartTime] = useState('08:00');
  const [maxDosesPerDay, setMaxDosesPerDay] = useState('');
  const [useMaxDoses, setUseMaxDoses] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setInterval(medication.interval.toString());
      setStartTime(medication.startTime || '08:00');
      
      // Check if interval is custom
      const isCommon = COMMON_INTERVALS.some(i => i.value === medication.interval);
      setCustomInterval(!isCommon);
      
      if (medication.maxDosesPerDay) {
        setMaxDosesPerDay(medication.maxDosesPerDay.toString());
        setUseMaxDoses(true);
      } else {
        setMaxDosesPerDay('');
        setUseMaxDoses(false);
      }
    }
  }, [medication]);

  if (!isOpen || !medication) return null;

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

    onUpdate(medication.id, name.trim(), intervalValue, startTime, maxDoses);
    toast.success(`${t.medicationUpdated} ${name.trim()}`);
    onClose();
  };

  const handleDelete = () => {
    if (medication && onDelete) {
      onDelete(medication.id);
      toast.success(`${t.medicationRemoved} ${medication.name} ${t.fromSchedule}`);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t.editMedication}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label 
              htmlFor="edit-medication-name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t.medicationName}
            </label>
            <input
              id="edit-medication-name"
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
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                {t.startTime}
              </label>
              <TimeInput
                value={startTime}
                onChange={setStartTime}
                label=""
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.whenToTakeFirstDose}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Pill className="inline w-4 h-4 mr-1" />
                {t.maxDosesPerDay}
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-use-max-doses"
                    checked={useMaxDoses}
                    onChange={(e) => setUseMaxDoses(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="edit-use-max-doses" className="text-sm text-gray-600 dark:text-gray-400">
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
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-sm'
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
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-sm'
                  }
                `}
              >
                {customInterval && interval ? `${t.every} ${interval}${t.hours === 'hours' ? 'h' : ''}` : t.custom}
              </button>
            </div>
            
            {/* Custom interval input */}
            {customInterval && (
              <div className="mt-2 flex items-center space-x-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-indigo-500">
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
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                           transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  aria-label="Interval hours"
                  autoFocus
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t.hours}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-4">
            {/* Delete button on the left */}
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50
                         text-red-700 dark:text-red-400 font-medium rounded-xl
                         transition-all duration-200 hover:shadow-md"
              >
                <Trash2 className="w-5 h-5" />
                <span>{t.delete}</span>
              </button>
            )}
            
            {/* Save button on the right */}
            <button
              type="submit"
              disabled={!name || !interval}
              className="ml-auto flex items-center justify-center space-x-2 px-6 py-3
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                       disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600
                       text-white font-medium rounded-xl shadow-lg hover:shadow-xl
                       transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none
                       transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-2">
                {t.deleteMedication}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                {t.deleteConfirmation} <span className="font-semibold">{medication?.name}</span>? {t.cannotBeUndone}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                           text-slate-700 dark:text-slate-300 font-medium rounded-lg
                           transition-all duration-200"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600
                           text-white font-medium rounded-lg shadow-md hover:shadow-lg
                           transition-all duration-200"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}