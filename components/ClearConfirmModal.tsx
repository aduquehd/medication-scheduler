'use client';

import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  medicationCount: number;
}

export default function ClearConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  medicationCount 
}: ClearConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-2">
            Clear All Medications?
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            This will permanently delete all {medicationCount} medication{medicationCount !== 1 ? 's' : ''} and reset your schedule. This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 
                       text-slate-700 dark:text-slate-300 font-medium rounded-lg
                       hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5
                       bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600
                       text-white font-medium rounded-lg shadow-md hover:shadow-lg
                       transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}