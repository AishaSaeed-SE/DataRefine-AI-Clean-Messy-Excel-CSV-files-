
import React from 'react';

interface HeroProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onFileUpload, isLoading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-indigo-50 flex items-center justify-center">
          <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>
      <h2 className="text-5xl font-black text-[#0F172A] max-w-2xl leading-tight tracking-tight">
        Master Your Data with <span className="text-indigo-600">DataRefine AI</span>
      </h2>
      <p className="mt-6 text-slate-500 text-lg max-w-xl font-medium leading-relaxed">
        Upload your messy CSV or Excel datasets. Use natural language commands to transform, clean, and export production-ready insights in seconds.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4">
        <label className="cursor-pointer bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95">
          {isLoading ? 'INITIATING ENGINE...' : 'START NEW WORKSPACE'}
          <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileChange} />
        </label>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supports .CSV, .XLSX (Up to 100k rows)</p>
      </div>
    </div>
  );
};
