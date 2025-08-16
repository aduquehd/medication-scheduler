import { Medication, DoseSchedule } from '@/types/medication';

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const addHoursToTime = (time: string, hours: number): { time: string; isNextDay: boolean } => {
  const minutes = timeToMinutes(time);
  const newMinutes = minutes + hours * 60;
  const isNextDay = newMinutes >= 1440; // 24 hours = 1440 minutes
  const adjustedMinutes = newMinutes % 1440;
  
  return {
    time: minutesToTime(adjustedMinutes),
    isNextDay
  };
};

export const generateSchedule = (
  medications: Medication[],
  firstDoseTime: string
): DoseSchedule[] => {
  const schedule: DoseSchedule[] = [];
  
  medications.forEach((medication) => {
    // Use individual start time if available, otherwise use global first dose time
    const startTime = medication.startTime || firstDoseTime;
    const startMinutes = timeToMinutes(startTime);
    
    // Calculate potential doses per day based on interval
    const potentialDosesPerDay = Math.ceil(24 / medication.interval);
    
    // Apply max doses per day limit if specified
    const actualDosesPerDay = medication.maxDosesPerDay 
      ? Math.min(potentialDosesPerDay, medication.maxDosesPerDay)
      : potentialDosesPerDay;
    
    for (let i = 0; i < actualDosesPerDay; i++) {
      if (i === 0) {
        // First dose at the medication's start time
        schedule.push({
          medicationId: medication.id,
          medicationName: medication.name,
          time: startTime,
          doseNumber: i + 1,
          isNextDay: false,
          color: medication.color
        });
      } else {
        // Calculate subsequent doses based on interval
        const totalMinutes = startMinutes + (medication.interval * i * 60);
        const adjustedMinutes = totalMinutes % 1440;
        const doseTime = minutesToTime(adjustedMinutes);
        
        // Only add if dose is within 24 hours window
        if (totalMinutes - startMinutes < 1440) {
          schedule.push({
            medicationId: medication.id,
            medicationName: medication.name,
            time: doseTime,
            doseNumber: i + 1,
            isNextDay: false, // All doses within 24-hour view are "today"
            color: medication.color
          });
        }
      }
    }
  });
  
  // Sort schedule by time only (all doses are within 24-hour window)
  return schedule.sort((a, b) => {
    const aMinutes = timeToMinutes(a.time);
    const bMinutes = timeToMinutes(b.time);
    return aMinutes - bMinutes;
  });
};

export const validateTime = (time: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

export const formatTimeDisplay = (time: string): string => {
  if (!time || typeof time !== 'string') {
    return '12:00 AM'; // Default fallback
  }
  
  const parts = time.split(':');
  if (parts.length !== 2) {
    return '12:00 AM'; // Default fallback for invalid format
  }
  
  const [hours, minutes] = parts;
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export const getTimeUntilNextDose = (schedule: DoseSchedule[]): string | null => {
  if (schedule.length === 0) return null;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Find next dose
  const todayDoses = schedule.filter(dose => !dose.isNextDay);
  const nextDose = todayDoses.find(dose => timeToMinutes(dose.time) > currentMinutes);
  
  if (!nextDose) {
    // Check for tomorrow's first dose
    const tomorrowDoses = schedule.filter(dose => dose.isNextDay);
    if (tomorrowDoses.length > 0) {
      const minutesUntilMidnight = 1440 - currentMinutes;
      const minutesAfterMidnight = timeToMinutes(tomorrowDoses[0].time);
      const totalMinutes = minutesUntilMidnight + minutesAfterMidnight;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
    return null;
  }
  
  const minutesUntilDose = timeToMinutes(nextDose.time) - currentMinutes;
  const hours = Math.floor(minutesUntilDose / 60);
  const minutes = minutesUntilDose % 60;
  
  return `${hours}h ${minutes}m`;
};