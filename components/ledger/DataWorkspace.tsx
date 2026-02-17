
import React, { useState } from 'react';
import { DatasetState } from '../../types';
import { LedgerView } from './LedgerView';

interface DataWorkspaceProps {
  data: DatasetState | null;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  onViewLedger: () => void;
}

export const DataWorkspace: React.FC<DataWorkspaceProps> = ({ data, onFileUpload, isLoading, error, onViewLedger }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileUpload(file);
  };

  const handleExport = () => {
    if (!data) return;
    const ws = (window as any).XLSX.utils.json_to_sheet(data.rows);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "CleanedData");
    (window as any).XLSX.writeFile(wb, `CleanSlate_Export_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col h-full overflow-hidden transition-all">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Data Ledger Preview</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">{data?.filename || 'Idle Engine'}</span>
              {data && (
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-black border border-indigo-100 uppercase tracking-tighter">
                    {data.rows.length.toLocaleString()} ROWS
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            <button 
              onClick={onViewLedger}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all border border-indigo-100"
            >
              Enter Ledger View
            </button>
            <button 
              onClick={handleExport}
              disabled={isLoading}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export XLSX
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden bg-slate-50/50">
        {/* Full View Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Syncing Changes</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-[0.2em] animate-pulse">Running Neural Transformation Engine</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-6">
            <div className="p-4 bg-rose-50 border-2 border-rose-100 text-rose-600 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-4">
              <span className="bg-rose-600 text-white p-2 rounded-xl">!</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!data ? (
          <div className="h-full flex flex-col items-center justify-center p-12">
            {/* Logic moved to Hero component for cleaner main App layout */}
          </div>
        ) : (
          <LedgerView headers={data.headers} rows={data.rows} />
        )}
      </div>
    </div>
  );
};
