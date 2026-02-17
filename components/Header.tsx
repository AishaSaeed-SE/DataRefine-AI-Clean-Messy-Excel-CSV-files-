
import React from 'react';

interface HeaderProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  datasetName?: string;
  activeTab?: 'NEW' | 'PROCESSING' | 'STUDIO';
  onTabChange?: (tab: 'NEW' | 'PROCESSING' | 'STUDIO') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onReset, 
  onUndo, 
  canUndo, 
  datasetName, 
  activeTab = 'NEW',
  onTabChange 
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div 
          className="bg-indigo-600 w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer" 
          onClick={() => onTabChange?.('NEW')}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 3v19M5 8h14M5 16h14" />
          </svg>
        </div>
        <div className="cursor-pointer" onClick={() => onTabChange?.('NEW')}>
          <h1 className="text-lg font-black tracking-tight text-[#0F172A]">
            DataRefine AI
          </h1>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest -mt-1">Intelligent Workspace</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
        {(['NEW', 'PROCESSING', 'STUDIO'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            disabled={tab !== 'NEW' && !datasetName}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] transition-all ${
              activeTab === tab 
                ? 'bg-white text-indigo-600 shadow-sm border-transparent' 
                : 'text-slate-400 hover:text-slate-600 border-transparent'
            } ${tab !== 'NEW' && !datasetName ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
             {tab === 'NEW' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>}
             {tab === 'PROCESSING' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7"/></svg>}
             {tab === 'STUDIO' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>}
             {tab}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {datasetName && (
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-bold text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
            NEW UPLOAD
          </button>
        )}
        <button className="bg-[#0F172A] text-white px-8 py-2.5 rounded-2xl text-[11px] font-black tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          SIGN IN
        </button>
      </div>
    </header>
  );
};
