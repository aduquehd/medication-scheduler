'use client';

import { DoseSchedule } from '@/types/medication';
import { formatTimeDisplay } from '@/utils/timeCalculations';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import TimelineProgressBar from './TimelineProgressBar';

interface ScheduleDisplayProps {
  schedule: DoseSchedule[];
  firstDoseTime: string;
  hoveredMedicationIds?: string[];
}

export default function ScheduleDisplay({ schedule, firstDoseTime, hoveredMedicationIds }: ScheduleDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time clock

    return () => clearInterval(timer);
  }, []);

  if (schedule.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-8 text-center transition-all duration-200 border border-slate-100 dark:border-slate-800">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          Your medication schedule will appear here once you add medications.
        </p>
      </div>
    );
  }

  // Group doses by time
  const groupedSchedule = schedule.reduce((acc, dose) => {
    const key = `${dose.time}-${dose.isNextDay}`;
    if (!acc[key]) {
      acc[key] = {
        time: dose.time,
        isNextDay: dose.isNextDay,
        doses: []
      };
    }
    acc[key].doses.push(dose);
    return acc;
  }, {} as Record<string, { time: string; isNextDay: boolean; doses: DoseSchedule[] }>);

  const sortedGroups = Object.values(groupedSchedule).sort((a, b) => {
    if (a.isNextDay !== b.isNextDay) {
      return a.isNextDay ? 1 : -1;
    }
    const aMinutes = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
    const bMinutes = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
    return aMinutes - bMinutes;
  });

  const isCurrentDose = (time: string, isNextDay: boolean) => {
    if (isNextDay) return false;
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const doseTime = new Date();
    doseTime.setHours(hours, minutes, 0, 0);
    
    const timeDiff = Math.abs(now.getTime() - doseTime.getTime());
    return timeDiff < 30 * 60 * 1000; // Within 30 minutes
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-200 border border-slate-100 dark:border-slate-800">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          24-Hour Schedule
        </h2>
      </div>

      {/* Real-time Clock */}
      <div className="mb-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center space-x-4">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white font-mono">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Progress Bar */}
      <div className="mb-4">
        <TimelineProgressBar schedule={schedule} />
      </div>

      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <AlertCircle className="w-4 h-4" />
          <span>First dose starts at {formatTimeDisplay(firstDoseTime)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedGroups.map((group, index) => {
          const isCurrent = isCurrentDose(group.time, group.isNextDay);
          const hasHighlightedMedication = group.doses.some(dose => 
            hoveredMedicationIds?.includes(dose.medicationId)
          );
          
          return (
            <div
              key={`${group.time}-${group.isNextDay}-${index}`}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${isCurrent 
                  ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-600 shadow-md' 
                  : hasHighlightedMedication
                  ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-800/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`
                    text-lg font-semibold
                    ${isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-800 dark:text-white'
                    }
                  `}>
                    {formatTimeDisplay(group.time)}
                  </span>
                  {group.isNextDay && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
                      Next Day
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium animate-pulse">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.doses.map((dose) => {
                  const isHighlighted = hoveredMedicationIds?.includes(dose.medicationId) || false;
                  return (
                    <div
                      key={`${dose.medicationId}-${dose.doseNumber}`}
                      className={`
                        inline-flex items-center rounded-full pl-1 pr-2 py-0.5 transition-all duration-200 border
                        ${isHighlighted 
                          ? 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 shadow-sm scale-105' 
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }
                      `}
                    >
                      <div className={`
                        ${isHighlighted ? 'w-2.5 h-2.5' : 'w-2 h-2'} 
                        rounded-full ${dose.color}
                        transition-all duration-200 mr-1.5
                      `} />
                      <span className={`
                        text-xs transition-all duration-200
                        ${isHighlighted 
                          ? 'text-gray-900 dark:text-white font-semibold' 
                          : 'text-gray-700 dark:text-gray-300'
                        }
                      `}>
                        {dose.medicationName}
                      </span>
                      <span className={`
                        ml-1 text-xs font-bold transition-all duration-200
                        ${isHighlighted 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-400 dark:text-slate-500'
                        }
                      `}>
                        #{dose.doseNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Total doses today: {schedule.filter(d => !d.isNextDay).length}</span>
          <span>Next day doses: {schedule.filter(d => d.isNextDay).length}</span>
        </div>
      </div>
    </div>
  );
}