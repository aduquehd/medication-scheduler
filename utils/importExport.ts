import { Medication } from '@/types/medication';
import { validateTime } from './timeCalculations';

export interface ScheduleExport {
  version: string;
  exportDate: string;
  defaultStartTime: string;
  medications: Medication[];
}

export const exportSchedule = (medications: Medication[], defaultStartTime: string): void => {
  const exportData: ScheduleExport = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    defaultStartTime,
    medications
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `medication-schedule-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateImportData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check basic structure
  if (!data || typeof data !== 'object') {
    errors.push('Invalid JSON structure');
    return { valid: false, errors };
  }

  // Check version
  if (!data.version) {
    errors.push('Missing version field');
  }

  // Validate defaultStartTime
  if (!data.defaultStartTime) {
    errors.push('Missing default start time');
  } else if (!validateTime(data.defaultStartTime)) {
    errors.push('Invalid default start time format');
  }

  // Validate medications array
  if (!Array.isArray(data.medications)) {
    errors.push('Medications must be an array');
  } else {
    data.medications.forEach((med: any, index: number) => {
      if (!med.name || typeof med.name !== 'string') {
        errors.push(`Medication ${index + 1}: Missing or invalid name`);
      }
      
      if (!med.interval || typeof med.interval !== 'number' || med.interval <= 0 || med.interval > 48) {
        errors.push(`Medication ${index + 1}: Invalid interval (must be between 0 and 48 hours)`);
      }
      
      if (!med.startTime || !validateTime(med.startTime)) {
        errors.push(`Medication ${index + 1}: Invalid start time`);
      }
      
      if (med.maxDosesPerDay !== undefined && 
          (typeof med.maxDosesPerDay !== 'number' || med.maxDosesPerDay < 1 || med.maxDosesPerDay > 10)) {
        errors.push(`Medication ${index + 1}: Invalid max doses per day (must be between 1 and 10)`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const importSchedule = (
  fileContent: string,
  onSuccess: (medications: Medication[], defaultStartTime: string) => void,
  onError: (error: string) => void
): void => {
  try {
    const data = JSON.parse(fileContent);
    const validation = validateImportData(data);
    
    if (!validation.valid) {
      onError(`Import failed:\n${validation.errors.join('\n')}`);
      return;
    }

    // Generate new IDs and colors for imported medications
    const importedMedications: Medication[] = data.medications.map((med: any, index: number) => ({
      id: Date.now().toString() + '-' + index,
      name: med.name,
      interval: med.interval,
      startTime: med.startTime,
      maxDosesPerDay: med.maxDosesPerDay,
      color: med.color || `bg-blue-500`, // Will be reassigned in the hook
      createdAt: new Date().toISOString()
    }));

    onSuccess(importedMedications, data.defaultStartTime);
  } catch (error) {
    onError(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const handleFileSelect = (
  file: File,
  onSuccess: (medications: Medication[], defaultStartTime: string) => void,
  onError: (error: string) => void
): void => {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    onError('Please select a valid JSON file');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    const content = e.target?.result as string;
    importSchedule(content, onSuccess, onError);
  };
  
  reader.onerror = () => {
    onError('Failed to read file');
  };
  
  reader.readAsText(file);
};