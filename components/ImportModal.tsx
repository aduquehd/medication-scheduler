'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, Clipboard, AlertCircle, FileJson, FlaskConical, ClipboardPaste } from 'lucide-react';
import { validateImportData, handleFileSelect } from '@/utils/importExport';
import { useTranslation } from '@/hooks/useTranslation';
import { Medication } from '@/types/medication';
import toast from 'react-hot-toast';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (medications: Medication[], defaultStartTime: string) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('paste');
  const [pastedJson, setPastedJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      handleFileSelect(
        file,
        (importedMeds, importedStartTime) => {
          onImport(importedMeds, importedStartTime);
          toast.success(`${t.imported} ${importedMeds.length} ${importedMeds.length !== 1 ? t.medications : t.medication}`);
          onClose();
        },
        (errorMsg) => {
          setError(errorMsg);
          toast.error(errorMsg);
        }
      );
    }
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handlePaste = () => {
    setError(null);
    
    if (!pastedJson.trim()) {
      setError(t.pleasePasteJSON);
      return;
    }

    try {
      const data = JSON.parse(pastedJson);
      const validationResult = validateImportData(data);
      
      if (!validationResult.isValid) {
        setError(validationResult.error || t.invalidDataFormat);
        toast.error(validationResult.error || t.invalidDataFormat);
        return;
      }

      onImport(validationResult.medications!, validationResult.defaultStartTime!);
      toast.success(`${t.imported} ${validationResult.medications!.length} ${validationResult.medications!.length !== 1 ? t.medications : t.medication}`);
      setPastedJson('');
      onClose();
    } catch (err) {
      setError(t.invalidJSONFormat);
      toast.error(t.invalidJSONFormat);
    }
  };

  const handleSampleData = () => {
    const sampleData = {
      version: "1.0",
      defaultStartTime: "08:00",
      medications: [
        {
          id: "sample1",
          name: "Sample Medication",
          interval: 6,
          startTime: "08:00",
          maxDosesPerDay: 4,
          color: "bg-blue-600",
          createdAt: new Date().toISOString()
        }
      ]
    };
    setPastedJson(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t.importSchedule}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-all ${
              activeTab === 'paste'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clipboard className="w-5 h-5" />
            <span>{t.pasteJSON}</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 transition-all ${
              activeTab === 'file'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>{t.uploadFile}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'paste' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.pasteYourJSON}
                </label>
                <textarea
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  placeholder={`{
  "version": "1.0",
  "defaultStartTime": "08:00",
  "medications": [...]
}`}
                  className="w-full h-64 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                           font-mono text-sm resize-none"
                />
              </div>
              
              <div className="space-y-3">
                {/* Main action buttons - Paste and Import */}
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        setPastedJson(text);
                        toast.success(t.pastedFromClipboard);
                      } catch (err) {
                        toast.error(t.failedToReadClipboard);
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 
                             bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700
                             text-white font-medium rounded-lg shadow-md hover:shadow-lg 
                             transition-all duration-200"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    <span>{t.paste}</span>
                  </button>
                  <button
                    onClick={handlePaste}
                    disabled={!pastedJson.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 
                             bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 
                             disabled:from-gray-400 disabled:to-gray-400
                             text-white font-medium rounded-lg shadow-md hover:shadow-lg 
                             transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <FileJson className="w-4 h-4" />
                    <span>{t.importData}</span>
                  </button>
                </div>
                
                {/* Load Sample button below */}
                <button
                  onClick={handleSampleData}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                           text-blue-600 dark:text-blue-400 
                           hover:bg-blue-50 dark:hover:bg-blue-950/30 
                           border border-blue-300 dark:border-blue-700
                           font-medium rounded-lg transition-all duration-200"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{t.loadSampleData}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t.dropFileHere}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 
                           text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.chooseFile}</span>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  {t.acceptsJSON}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.importFormat}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.importFormatDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}