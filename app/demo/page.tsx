'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_DATA = {
  "version": "1.0",
  "exportDate": "2025-08-16T07:05:29.687Z",
  "defaultStartTime": "08:00",
  "medications": [
    {
      "id": "demo-1",
      "name": "CEFALEXINA",
      "interval": 6,
      "startTime": "08:00",
      "color": "bg-blue-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-2",
      "name": "SINALGEN",
      "interval": 6,
      "startTime": "12:00",
      "maxDosesPerDay": 3,
      "color": "bg-emerald-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-3",
      "name": "ARCOXIA",
      "interval": 24,
      "startTime": "09:00",
      "color": "bg-violet-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-4",
      "name": "PREDNISONA",
      "interval": 24,
      "startTime": "10:00",
      "color": "bg-rose-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-5",
      "name": "TIZANIDINA",
      "interval": 24,
      "startTime": "23:00",
      "color": "bg-teal-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-6",
      "name": "ESOMEPRAZOL",
      "interval": 24,
      "startTime": "08:00",
      "color": "bg-indigo-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    },
    {
      "id": "demo-7",
      "name": "ACETAMINOFEN",
      "interval": 6,
      "startTime": "12:00",
      "maxDosesPerDay": 3,
      "color": "bg-cyan-600",
      "createdAt": "2025-08-16T04:24:22.687Z"
    }
  ]
};

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if demo data is already loaded
    const existingData = localStorage.getItem('medicationSchedule');
    if (existingData) {
      // Save existing data as backup
      localStorage.setItem('medicationSchedule_backup', existingData);
    }

    // Load demo data
    localStorage.setItem('medicationSchedule', JSON.stringify({
      medications: DEMO_DATA.medications,
      firstDoseTime: DEMO_DATA.defaultStartTime
    }));

    // Add a demo mode flag
    localStorage.setItem('demoMode', 'true');

    // Force a hard refresh to reload the data
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading demo...</p>
      </div>
    </div>
  );
}