'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, X, Share2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Medication } from '@/types/medication';
import { ScheduleExport } from '@/utils/importExport';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  defaultStartTime: string;
}

export default function ShareModal({ isOpen, onClose, medications, defaultStartTime }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  if (!isOpen) return null;

  const exportData: ScheduleExport = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    defaultStartTime,
    medications
  };

  const jsonString = JSON.stringify(exportData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medication-schedule-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Schedule downloaded!');
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const file = new File([blob], `medication-schedule-${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' });
        
        await navigator.share({
          title: 'Medication Schedule',
          text: 'My medication schedule',
          files: [file]
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      toast.error('Sharing is not supported on this device');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Schedule</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Export your medication schedule as JSON data. You can copy it to clipboard or download as a file.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 relative border border-slate-200 dark:border-slate-700">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto max-h-96 overflow-y-auto">
                {jsonString}
              </pre>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="font-semibold mb-1">How to import this schedule:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the JSON data above or download it as a file</li>
              <li>Open the Import modal using the Import button</li>
              <li>Paste the JSON in the "Paste JSON" tab or upload the file in the "Upload File" tab</li>
              <li>Click "Import Data" to load your medications</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}