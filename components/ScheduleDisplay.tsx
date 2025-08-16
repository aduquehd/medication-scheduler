'use client';

import { DoseSchedule } from '@/types/medication';
import { formatTimeDisplay } from '@/utils/timeCalculations';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';
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
          
          // Check if we should show the current time indicator before this item
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          
          const [groupHour, groupMinute] = group.time.split(':').map(Number);
          const groupTimeInMinutes = groupHour * 60 + groupMinute;
          
          let showTimeLine = false;
          
          if (!group.isNextDay) {
            if (index === 0 && currentTimeInMinutes < groupTimeInMinutes) {
              // Show line before first dose if current time is earlier
              showTimeLine = true;
            } else if (index > 0) {
              const prevGroup = sortedGroups[index - 1];
              if (!prevGroup.isNextDay) {
                const [prevHour, prevMinute] = prevGroup.time.split(':').map(Number);
                const prevTimeInMinutes = prevHour * 60 + prevMinute;
                
                if (currentTimeInMinutes >= prevTimeInMinutes && currentTimeInMinutes < groupTimeInMinutes) {
                  showTimeLine = true;
                }
              }
            }
          }
          
          // Check if we should show line after the last today's dose
          const isLastTodayDose = !group.isNextDay && 
            (index === sortedGroups.length - 1 || sortedGroups[index + 1].isNextDay);
          const showLineAfter = isLastTodayDose && currentTimeInMinutes >= groupTimeInMinutes;
          
          // Calculate missing hours between previous dose and current dose
          const missingHours: number[] = [];
          if (index > 0 && !group.isNextDay) {
            const prevGroup = sortedGroups[index - 1];
            if (!prevGroup.isNextDay) {
              const [prevHour] = prevGroup.time.split(':').map(Number);
              const [currentGroupHour] = group.time.split(':').map(Number);
              
              // Add all whole hours between previous and current dose
              for (let h = prevHour + 1; h < currentGroupHour; h++) {
                missingHours.push(h);
              }
            }
          } else if (index === 0 && !group.isNextDay) {
            // Add missing hours before first dose (from start of day)
            const [firstHour] = group.time.split(':').map(Number);
            const startHour = Math.max(0, firstHour - 3); // Show up to 3 hours before first dose
            for (let h = startHour; h < firstHour; h++) {
              missingHours.push(h);
            }
          }
          
          return (
            <React.Fragment key={`${group.time}-${group.isNextDay}-${index}`}>
              {/* Show missing hour lines before this dose */}
              {missingHours.map((hour) => {
                const hourTime = new Date();
                hourTime.setHours(hour, 0, 0, 0);
                const hourTimeInMinutes = hour * 60;
                const shouldShowNowHere = !group.isNextDay && currentTimeInMinutes >= hourTimeInMinutes && currentTimeInMinutes < hourTimeInMinutes + 60;
                
                return shouldShowNowHere ? (
                  // Show NOW line instead of missing hour if current time is in this hour
                  <div key={`now-${hour}`} className="flex items-center space-x-2 -my-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-red-500 whitespace-nowrap">
                        NOW - {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500 via-red-300 to-transparent" />
                  </div>
                ) : (
                  <div key={`missing-${hour}`} className="flex items-center space-x-2 -my-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap min-w-[65px]">
                      {hourTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700" />
                  </div>
                );
              })}
              {showTimeLine && (
                <div className="flex items-center space-x-2 -my-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-red-500 whitespace-nowrap">
                      NOW - {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500 via-red-300 to-transparent" />
                </div>
              )}
              <div
                className={`
                border rounded-lg p-3 transition-all duration-200
                ${isCurrent 
                  ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-600 shadow-md' 
                  : hasHighlightedMedication
                  ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-800/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`
                    text-base font-semibold
                    ${isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-800 dark:text-white'
                    }
                  `}>
                    {formatTimeDisplay(group.time)}
                  </span>
                  {group.isNextDay && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                      Next Day
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium animate-pulse">
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
              {showLineAfter && (
                <div className="flex items-center space-x-2 -my-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-red-500 whitespace-nowrap">
                      NOW - {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500 via-red-300 to-transparent" />
                </div>
              )}
              {/* Show missing hours after the last dose of today */}
              {isLastTodayDose && !showLineAfter && (() => {
                const missingHoursAfter: number[] = [];
                const [lastHour] = group.time.split(':').map(Number);
                const endHour = Math.min(23, lastHour + 3); // Show up to 3 hours after last dose or until 11 PM
                
                for (let h = lastHour + 1; h <= endHour; h++) {
                  missingHoursAfter.push(h);
                }
                
                return missingHoursAfter.map((hour) => {
                  const hourTime = new Date();
                  hourTime.setHours(hour, 0, 0, 0);
                  const hourTimeInMinutes = hour * 60;
                  const shouldShowNowHere = currentTimeInMinutes >= hourTimeInMinutes && currentTimeInMinutes < hourTimeInMinutes + 60;
                  
                  return shouldShowNowHere ? (
                    <div key={`now-after-${hour}`} className="flex items-center space-x-2 -my-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-500 whitespace-nowrap">
                          NOW - {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500 via-red-300 to-transparent" />
                    </div>
                  ) : (
                    <div key={`missing-after-${hour}`} className="flex items-center space-x-2 -my-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap min-w-[65px]">
                        {hourTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700" />
                    </div>
                  );
                });
              })()}
            </React.Fragment>
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