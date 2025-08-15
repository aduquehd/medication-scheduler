'use client';

import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import MedicationForm from '@/components/MedicationForm';
import MedicationList from '@/components/MedicationList';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import TimeInput from '@/components/TimeInput';
import { useMedicationSchedule } from '@/hooks/useMedicationSchedule';
import { exportSchedule, handleFileSelect } from '@/utils/importExport';
import { RefreshCw, Sun, Moon, Download, Upload, Share2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ShareModal from '@/components/ShareModal';

export default function Home() {
  const {
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
  } = useMedicationSchedule();

  const [darkMode, setDarkMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hoveredMedicationId, setHoveredMedicationId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleExport = () => {
    if (medications.length === 0) {
      toast.error('No medications to export');
      return;
    }
    exportSchedule(medications, firstDoseTime);
    toast.success('Schedule exported successfully');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(
        file,
        (importedMeds, importedStartTime) => {
          importMedications(importedMeds, importedStartTime);
          toast.success(`Imported ${importedMeds.length} medication${importedMeds.length !== 1 ? 's' : ''}`);
        },
        (error) => {
          toast.error(error);
        }
      );
    }
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                Medication Scheduler
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your medications and never miss a dose
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Import/Export buttons */}
              <div className="flex items-center space-x-1 mr-2">
                <button
                  onClick={handleImport}
                  className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all hover:shadow-md group relative"
                  aria-label="Import schedule"
                >
                  <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Import
                  </span>
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all hover:shadow-md group relative"
                  aria-label="Export schedule"
                  disabled={medications.length === 0}
                >
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Export
                  </span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all hover:shadow-md group relative"
                  aria-label="Share schedule"
                  disabled={medications.length === 0}
                >
                  <Share2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Share
                  </span>
                </button>
              </div>
              
              {/* Theme and Clear buttons */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:shadow-md"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              {medications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all hover:shadow-md"
                  aria-label="Clear all medications"
                >
                  <RefreshCw className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Global Default Start Time Setting */}
        <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-200 border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Default Start Time
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Set the default start time for new medications. Each medication can have its own custom start time.
          </p>
          <TimeInput
            value={firstDoseTime}
            onChange={updateFirstDoseTime}
            label="Default start time"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <MedicationForm onAdd={addMedication} defaultStartTime={firstDoseTime} />
            <MedicationList 
              medications={medications} 
              onRemove={removeMedication}
              onUpdate={updateMedication}
              onHover={setHoveredMedicationId}
            />
          </div>

          {/* Right Column - Schedule */}
          <div>
            <ScheduleDisplay 
              schedule={schedule} 
              firstDoseTime={firstDoseTime}
              hoveredMedicationId={hoveredMedicationId}
            />
          </div>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import JSON file"
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          medications={medications}
          defaultStartTime={firstDoseTime}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Remember to consult with your healthcare provider about your medication schedule.
            </p>
            <p className="mt-2">
              This tool is for organizational purposes only and does not replace professional medical advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}