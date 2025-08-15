export interface Medication {
  id: string;
  name: string;
  interval: number; // in hours
  startTime: string; // HH:mm format - individual start time for this medication
  maxDosesPerDay?: number; // optional maximum doses per day
  color: string;
  createdAt: string;
}

export interface DoseSchedule {
  medicationId: string;
  medicationName: string;
  time: string; // HH:mm format
  doseNumber: number;
  isNextDay: boolean;
  color: string;
}

export interface MedicationSchedule {
  firstDoseTime: string; // HH:mm format
  medications: Medication[];
  schedule: DoseSchedule[];
}