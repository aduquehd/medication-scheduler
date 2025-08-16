'use client';

import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import MedicationList from '@/components/MedicationList';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import { useMedicationSchedule } from '@/hooks/useMedicationSchedule';
import { useTranslation } from '@/hooks/useTranslation';
import { RefreshCw, Sun, Moon, Upload, Share2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import ShareModal from '@/components/ShareModal';
import ImportModal from '@/components/ImportModal';
import AddMedicationModal from '@/components/AddMedicationModal';
import ClearConfirmModal from '@/components/ClearConfirmModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Medication } from '@/types/medication';

export default function Home() {
  const { t } = useTranslation();
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [hoveredMedicationIds, setHoveredMedicationIds] = useState<string[]>([]);

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

  const handleImportMedications = (medications: Medication[], defaultStartTime: string) => {
    importMedications(medications, defaultStartTime);
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
          {/* Title row - same for mobile and desktop */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/medication-scheduler-logo.png" 
                alt="Medication Scheduler Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-sm"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {t.appTitle}
              </h1>
            </div>
            {/* Desktop: Theme and Language buttons in header */}
            <div className="hidden sm:flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:shadow-md"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile: Toggle buttons below title */}
          <div className="flex justify-end space-x-2 sm:hidden">
            <LanguageSwitcher />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:shadow-md"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </header>

        {/* Action Buttons - Mobile: 2 rows, Desktop: 1 row */}
        <div className="mb-6">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            {/* Import/Export buttons - Top row, full width */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all hover:shadow-md"
                aria-label="Import schedule"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t.import}</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Share/Export schedule"
                disabled={medications.length === 0}
              >
                <Share2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{t.export}</span>
              </button>
            </div>
            
            {/* Add Medication Button - Bottom row, full width */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                       text-white font-medium rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{t.addMedication}</span>
            </button>
          </div>

          {/* Desktop Layout - Original single row */}
          <div className="hidden sm:flex justify-between gap-2">
            {/* Add Medication Button - Left */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                       text-white font-medium rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{t.addMedication}</span>
            </button>

            {/* Import/Export buttons - Right */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all hover:shadow-md"
                aria-label="Import schedule"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t.import}</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Share/Export schedule"
                disabled={medications.length === 0}
              >
                <Share2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{t.export}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Medications */}
          <div>
            <MedicationList 
              medications={medications} 
              onRemove={removeMedication}
              onUpdate={updateMedication}
              onHover={setHoveredMedicationIds}
              onClearAll={() => setShowClearModal(true)}
            />
          </div>

          {/* Right Column - Schedule */}
          <div>
            <ScheduleDisplay 
              schedule={schedule} 
              firstDoseTime={firstDoseTime}
              hoveredMedicationIds={hoveredMedicationIds}
            />
          </div>
        </div>

        {/* Add Medication Modal */}
        <AddMedicationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={addMedication}
          defaultStartTime={firstDoseTime}
          onUpdateDefaultTime={updateFirstDoseTime}
        />

        {/* Import Modal */}
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportMedications}
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          medications={medications}
          defaultStartTime={firstDoseTime}
        />

        {/* Clear Confirmation Modal */}
        <ClearConfirmModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={clearAll}
          medicationCount={medications.length}
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