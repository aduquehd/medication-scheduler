'use client';

import { useState, useEffect, useCallback } from 'react';
import { Medication, DoseSchedule } from '@/types/medication';
import { generateSchedule } from '@/utils/timeCalculations';

const STORAGE_KEY = 'medication-schedule';

const MEDICATION_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-cyan-600',
  'bg-orange-600',
];

export const useMedicationSchedule = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [firstDoseTime, setFirstDoseTime] = useState<string>('08:00');
  const [schedule, setSchedule] = useState<DoseSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const defaultTime = data.firstDoseTime || '08:00';
          
          // Migrate existing medications without startTime field
          const migratedMedications = (data.medications || []).map((med: any) => ({
            ...med,
            startTime: med.startTime || defaultTime,
            maxDosesPerDay: med.maxDosesPerDay || undefined
          }));
          
          setMedications(migratedMedications);
          setFirstDoseTime(defaultTime);
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      const data = {
        medications,
        firstDoseTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [medications, firstDoseTime, isLoading]);

  // Generate schedule whenever medications or first dose time changes
  useEffect(() => {
    const newSchedule = generateSchedule(medications, firstDoseTime);
    setSchedule(newSchedule);
  }, [medications, firstDoseTime]);

  const addMedication = useCallback((
    name: string, 
    interval: number,
    startTime: string,
    maxDosesPerDay?: number
  ) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name,
      interval,
      startTime,
      maxDosesPerDay,
      color: MEDICATION_COLORS[medications.length % MEDICATION_COLORS.length],
      createdAt: new Date().toISOString(),
    };
    setMedications(prev => [...prev, newMedication]);
  }, [medications.length]);

  const removeMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  }, []);

  const updateMedication = useCallback((
    id: string,
    name: string,
    interval: number,
    startTime: string,
    maxDosesPerDay?: number
  ) => {
    setMedications(prev => prev.map(med => 
      med.id === id 
        ? { ...med, name, interval, startTime, maxDosesPerDay }
        : med
    ));
  }, []);

  const updateFirstDoseTime = useCallback((time: string) => {
    setFirstDoseTime(time);
  }, []);

  const clearAll = useCallback(() => {
    setMedications([]);
    setFirstDoseTime('08:00');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const importMedications = useCallback((importedMeds: Medication[], importedStartTime: string) => {
    // Assign colors to imported medications
    const medsWithColors = importedMeds.map((med, index) => ({
      ...med,
      color: MEDICATION_COLORS[index % MEDICATION_COLORS.length]
    }));
    
    setMedications(medsWithColors);
    setFirstDoseTime(importedStartTime);
  }, []);

  return {
    medications,
    firstDoseTime,
    schedule,
    isLoading,
    addMedication,
    removeMedication,
    updateMedication,
    updateFirstDoseTime,
    clearAll,
    importMedications,
  };
};