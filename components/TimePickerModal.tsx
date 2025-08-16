'use client';

import { useState, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TimePickerModalProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

export default function TimePickerModal({ value, onChange, label }: TimePickerModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      const isPM = h >= 12;
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      setHours(displayHour);
      setMinutes(m || 0);
      setPeriod(isPM ? 'PM' : 'AM');
    }
  }, [value]);

  const formatTime = (h: number, m: number, p: 'AM' | 'PM'): string => {
    let hour24 = h;
    if (p === 'PM' && h !== 12) hour24 += 12;
    if (p === 'AM' && h === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formatDisplay = (): string => {
    if (!value) return '--:--';
    const [h, m] = value.split(':').map(Number);
    const isPM = h >= 12;
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
  };

  const incrementHours = () => {
    setHours(prev => (prev === 12 ? 1 : prev + 1));
  };

  const decrementHours = () => {
    setHours(prev => (prev === 1 ? 12 : prev - 1));
  };

  const incrementMinutes = () => {
    setMinutes(prev => (prev === 59 ? 0 : prev + 1));
  };

  const decrementMinutes = () => {
    setMinutes(prev => (prev === 0 ? 59 : prev - 1));
  };

  const incrementMinutesByTen = () => {
    setMinutes(prev => {
      const next = Math.floor(prev / 10) * 10 + 10;
      return next > 59 ? 0 : next;
    });
  };

  const decrementMinutesByTen = () => {
    setMinutes(prev => {
      const next = Math.ceil(prev / 10) * 10 - 10;
      return next < 0 ? 50 : next;
    });
  };

  const handleConfirm = () => {
    const time = formatTime(hours, minutes, period);
    onChange(time);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      const isPM = h >= 12;
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      setHours(displayHour);
      setMinutes(m || 0);
      setPeriod(isPM ? 'PM' : 'AM');
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Input Field */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-2.5 pr-10 text-left border border-slate-200 dark:border-slate-700 rounded-lg 
                   bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-slate-900 dark:text-white transition-all duration-200"
        >
          <span className="text-base font-medium">{formatDisplay()}</span>
        </button>
        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
          onClick={handleCancel}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {label || t.selectTime || 'Select Time'}
              </h3>
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementHours}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  type="text"
                  value={hours.toString().padStart(2, '0')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setHours(12);
                    } else if (val.length <= 2) {
                      const num = parseInt(val, 10);
                      // Allow typing intermediate values, will validate on blur
                      if (num === 0) {
                        setHours(12);
                      } else if (num <= 12) {
                        setHours(num);
                      } else if (val.length === 1) {
                        // Allow single digit that might become valid (like "2" for "20")
                        setHours(num);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '' || val === '0') {
                      setHours(12);
                    } else {
                      const num = parseInt(val, 10);
                      if (num > 12) {
                        setHours(12);
                      } else if (num < 1) {
                        setHours(1);
                      } else {
                        setHours(num);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="my-2 px-2 py-3 bg-gray-50 dark:bg-slate-800 rounded-lg w-[70px] text-center
                           text-3xl font-bold text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={decrementHours}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Separator */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white pb-8">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementMinutesByTen}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    incrementMinutes();
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  type="text"
                  value={minutes.toString().padStart(2, '0')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setMinutes(0);
                    } else if (val.length <= 2) {
                      const num = parseInt(val, 10);
                      // Allow typing intermediate values, will validate on blur
                      if (num <= 59) {
                        setMinutes(num);
                      } else if (val.length === 1) {
                        // Allow single digit that might become valid (like "6" for "60" which will be corrected)
                        setMinutes(num);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setMinutes(0);
                    } else {
                      const num = parseInt(val, 10);
                      if (num > 59) {
                        setMinutes(59);
                      } else {
                        setMinutes(num);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="my-2 px-2 py-3 bg-gray-50 dark:bg-slate-800 rounded-lg w-[70px] text-center
                           text-3xl font-bold text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={decrementMinutesByTen}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    decrementMinutes();
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col space-y-2 ml-2">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    period === 'AM'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    period === 'PM'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { h: 6, p: 'AM' as const },
                { h: 8, p: 'AM' as const },
                { h: 10, p: 'AM' as const },
                { h: 12, p: 'PM' as const },
                { h: 2, p: 'PM' as const },
                { h: 4, p: 'PM' as const },
                { h: 6, p: 'PM' as const },
                { h: 8, p: 'PM' as const },
                { h: 10, p: 'PM' as const },
                { h: 12, p: 'AM' as const },
              ].map((time) => (
                <button
                  key={`${time.h}${time.p}`}
                  type="button"
                  onClick={() => {
                    setHours(time.h);
                    setMinutes(0);
                    setPeriod(time.p);
                  }}
                  className="px-1.5 py-1 text-xs font-medium rounded-lg
                           bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {time.h}:00 {time.p}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         text-gray-700 dark:text-gray-300 font-medium
                         hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg
                         text-white font-medium shadow-sm hover:shadow-md transition-all"
              >
                {t.confirm || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}