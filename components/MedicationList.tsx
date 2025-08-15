'use client';

import { useState } from 'react';
import { Medication } from '@/types/medication';
import { Pill, Calendar, RefreshCw, RotateCw } from 'lucide-react';
import { formatTimeDisplay } from '@/utils/timeCalculations';
import toast from 'react-hot-toast';
import EditMedicationModal from './EditMedicationModal';

interface MedicationListProps {
  medications: Medication[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  onHover?: (id: string | null) => void;
  onClearAll?: () => void;
}

export default function MedicationList({ medications, onRemove, onUpdate, onHover, onClearAll }: MedicationListProps) {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCardClick = (medication: Medication) => {
    setEditingMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingMedication(null);
  };

  if (medications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-6 sm:p-8 text-center transition-all duration-200 border border-slate-100 dark:border-slate-800">
        <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          No medications added yet. Add your first medication to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 transition-all duration-200 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Your Medications
        </h2>
        {medications.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg
                     bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50
                     transition-all hover:shadow-md group"
            aria-label="Clear all medications"
          >
            <RefreshCw className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Clear All</span>
          </button>
        )}
      </div>
      
      {/* Mobile: Compact list view, Desktop: 2 cards per row grid */}
      <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="relative flex flex-row p-3 sm:flex-col sm:p-4 rounded-lg border 
                     sm:border-2 hover:shadow-md sm:hover:shadow-lg sm:hover:scale-[1.01]
                     transition-all duration-200 group bg-white dark:bg-slate-800/50
                     border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500
                     cursor-pointer"
            onMouseEnter={() => onHover?.(medication.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => handleCardClick(medication)}
          >
            {/* Color indicator bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-2 ${medication.color} rounded-l-lg`} />
            
            {/* Mobile: Color dot with pill icon */}
            <div className={`w-10 h-10 rounded-full ${medication.color} flex items-center justify-center mr-3 flex-shrink-0 sm:hidden`}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            
            {/* Content */}
            <div className="ml-2 sm:ml-4 flex-1">
              {/* Desktop: Name at top with pill icon */}
              <div className="hidden sm:flex sm:items-center sm:mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full ${medication.color} flex items-center justify-center flex-shrink-0`}>
                    <Pill className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {medication.name}
                  </h3>
                </div>
              </div>

              {/* Mobile: Stack layout, Desktop: Compact info */}
              <div className="flex-1">
                {/* Mobile Name */}
                <div className="flex items-center justify-between mb-1 sm:hidden">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {medication.name}
                  </h3>
                </div>

                {/* Medication details */}
                {/* Mobile: Inline compact view */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400 sm:hidden">
                  <span className="flex items-center">
                    <RotateCw className="w-3 h-3 mr-1" />
                    Every {medication.interval}h
                  </span>
                  {medication.startTime && (
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatTimeDisplay(medication.startTime)}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Pill className="w-3 h-3 mr-1" />
                    {medication.maxDosesPerDay || Math.ceil(24 / medication.interval)}/day
                  </span>
                </div>
                
                {/* Desktop: Two column layout */}
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {/* Column 1: Interval and doses (stacked) */}
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <RotateCw className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      <span>Every {medication.interval}h</span>
                    </div>
                    <div className="flex items-center">
                      <Pill className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                      <span>
                        {medication.maxDosesPerDay || Math.ceil(24 / medication.interval)}/day
                      </span>
                    </div>
                  </div>
                  
                  {/* Column 2: Start time */}
                  <div>
                    {medication.startTime && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-500">Starts at</div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                          <span>{formatTimeDisplay(medication.startTime)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Total medications: {medications.length}
        </p>
      </div>

      {/* Edit Modal */}
      <EditMedicationModal
        medication={editingMedication}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onUpdate={onUpdate}
        onDelete={onRemove}
      />
    </div>
  );
}