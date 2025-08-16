'use client';

import { useEffect, useState } from 'react';
import { DoseSchedule } from '@/types/medication';
import { Clock } from 'lucide-react';

interface TimelineProgressBarProps {
  schedule: DoseSchedule[];
}

export default function TimelineProgressBar({ schedule }: TimelineProgressBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextDose, setNextDose] = useState<DoseSchedule | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (schedule.length === 0) {
      setNextDose(null);
      setTimeUntilNext('');
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find the next dose
    let foundNext: DoseSchedule | null = null;
    
    // First, look for doses today
    const todayDoses = schedule.filter(dose => !dose.isNextDay);
    for (const dose of todayDoses) {
      const [doseHour, doseMinute] = dose.time.split(':').map(Number);
      const doseTimeInMinutes = doseHour * 60 + doseMinute;
      
      if (doseTimeInMinutes > currentTimeInMinutes) {
        foundNext = dose;
        break;
      }
    }

    // If no dose found today, look for tomorrow's doses
    if (!foundNext) {
      const tomorrowDoses = schedule.filter(dose => dose.isNextDay);
      if (tomorrowDoses.length > 0) {
        foundNext = tomorrowDoses[0];
      }
    }

    setNextDose(foundNext);

    // Calculate time until next dose
    if (foundNext) {
      const [doseHour, doseMinute] = foundNext.time.split(':').map(Number);
      let doseDate = new Date();
      doseDate.setHours(doseHour, doseMinute, 0, 0);
      
      if (foundNext.isNextDay || doseDate <= now) {
        doseDate.setDate(doseDate.getDate() + 1);
      }

      const diff = doseDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeUntilNext('');
    }
  }, [schedule, currentTime]);

  if (schedule.length === 0) {
    return null;
  }

  // Get unique dose times for the timeline
  const uniqueTimes = Array.from(new Set(schedule.map(dose => dose.time))).sort();
  
  // Calculate progress percentage
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const dayTotalMinutes = 24 * 60;
  const progressPercentage = (currentTimeInMinutes / dayTotalMinutes) * 100;

  // Determine which doses are completed, current, and upcoming
  const getDoseStatus = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const doseTimeInMinutes = hour * 60 + minute;
    
    if (doseTimeInMinutes < currentTimeInMinutes) {
      return 'completed';
    } else if (nextDose && nextDose.time === time && !nextDose.isNextDay) {
      return 'next';
    } else if (doseTimeInMinutes > currentTimeInMinutes) {
      return 'upcoming';
    }
    return 'upcoming';
  };

  // Group medications for next dose display
  const nextDoseMedications = nextDose 
    ? schedule
        .filter(dose => dose.time === nextDose.time && dose.isNextDay === nextDose.isNextDay)
        .map(dose => dose.medicationName)
        .join(' • ')
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 transition-all duration-200 border border-slate-100 dark:border-slate-800">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Today's Timeline
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative mb-6">
        {/* Background bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          {/* Progress bar */}
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        {/* Dose markers */}
        <div className="absolute top-0 w-full h-2">
          {uniqueTimes.map((time, index) => {
            const [hour, minute] = time.split(':').map(Number);
            const timeInMinutes = hour * 60 + minute;
            const position = (timeInMinutes / dayTotalMinutes) * 100;
            const status = getDoseStatus(time);
            
            return (
              <div
                key={index}
                className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
                style={{ left: `${position}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-green-500 border-green-600 scale-110'
                      : status === 'next'
                      ? 'bg-blue-500 border-blue-600 scale-125 animate-pulse'
                      : 'bg-yellow-500 border-yellow-600'
                  }`}
                />
                {/* Time label */}
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {time}
                </span>
              </div>
            );
          })}

          {/* Current time marker */}
          <div
            className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2"
            style={{ left: `${progressPercentage}%` }}
          >
            <div className="w-3 h-3 bg-gray-800 dark:bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Spacer for time labels */}
      <div className="h-8" />

      {/* Next Dose Card */}
      {nextDose && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
          <div className="text-center">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-1">
              Next Dose In
            </div>
            <div className="text-3xl font-bold mb-2">
              {timeUntilNext}
            </div>
            <div className="text-sm font-medium opacity-95">
              {nextDoseMedications}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-gray-600 dark:text-gray-400">Next</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
        </div>
      </div>
    </div>
  );
}