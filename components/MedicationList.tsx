'use client';

import { useState } from 'react';
import { Medication } from '@/types/medication';
import { Trash2, Pill, Clock, Calendar, Hash, Edit2 } from 'lucide-react';
import { formatTimeDisplay } from '@/utils/timeCalculations';
import toast from 'react-hot-toast';
import EditMedicationModal from './EditMedicationModal';

interface MedicationListProps {
  medications: Medication[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string, interval: number, startTime: string, maxDosesPerDay?: number) => void;
  onHover?: (id: string | null) => void;
}

export default function MedicationList({ medications, onRemove, onUpdate, onHover }: MedicationListProps) {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleRemove = (medication: Medication) => {
    onRemove(medication.id);
    toast.success(`Removed ${medication.name} from schedule`);
  };

  const handleEdit = (medication: Medication) => {
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
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Your Medications
      </h2>
      
      {/* Mobile: Compact list view, Desktop: Card grid */}
      <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="relative flex flex-row sm:flex-col p-3 sm:p-4 rounded-lg border 
                     sm:border-2 hover:shadow-md sm:hover:shadow-lg sm:hover:scale-[1.02]
                     transition-all duration-200 group bg-white dark:bg-slate-800/50
                     border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
            onMouseEnter={() => onHover?.(medication.id)}
            onMouseLeave={() => onHover?.(null)}
          >
            {/* Color indicator bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-2 ${medication.color} rounded-l-lg`} />
            
            {/* Mobile: Color dot, Desktop: hidden (using bar) */}
            <div className={`w-10 h-10 rounded-full ${medication.color} flex items-center justify-center mr-3 flex-shrink-0 sm:hidden`}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            
            {/* Content */}
            <div className="ml-2 sm:ml-4 flex-1">
              {/* Header with name and action buttons */}
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`hidden sm:block w-4 h-4 rounded-full ${medication.color} ring-2 ring-white dark:ring-slate-800 shadow-sm`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                    {medication.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleEdit(medication)}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 
                             hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                    aria-label={`Edit ${medication.name}`}
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(medication)}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    aria-label={`Remove ${medication.name}`}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Medication details */}
              {/* Mobile: Inline compact view */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400 sm:hidden">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Every {medication.interval}h
                </span>
                {medication.startTime && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatTimeDisplay(medication.startTime)}
                  </span>
                )}
                <span className="flex items-center">
                  <Hash className="w-3 h-3 mr-1" />
                  {medication.maxDosesPerDay || Math.ceil(24 / medication.interval)} doses/day
                </span>
              </div>
              
              {/* Desktop: Vertical list view */}
              <div className="hidden sm:block space-y-2 text-sm">
                {/* Interval */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>
                    Every {medication.interval} hour{medication.interval !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Start time */}
                {medication.startTime && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>Starts at {formatTimeDisplay(medication.startTime)}</span>
                  </div>
                )}

                {/* Daily doses */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Hash className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>
                    {medication.maxDosesPerDay ? (
                      <>Max {medication.maxDosesPerDay} dose{medication.maxDosesPerDay !== 1 ? 's' : ''}/day</>
                    ) : (
                      <>{Math.ceil(24 / medication.interval)} dose{Math.ceil(24 / medication.interval) !== 1 ? 's' : ''}/day</>
                    )}
                  </span>
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
      />
    </div>
  );
}