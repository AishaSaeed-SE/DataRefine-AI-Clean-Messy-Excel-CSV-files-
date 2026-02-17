
import React, { useState, useRef, useEffect } from 'react';
import { Command } from '../../types';

interface CommandConsoleProps {
  commands: Command[];
  onAddCommand: (instruction: string) => void;
  onDeleteCommand: (id: string) => void;
  onApply: () => void;
  isProcessing: boolean;
  canApply: boolean;
  hasData: boolean;
  onUploadRequested: () => void;
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({ 
  commands, 
  onAddCommand,
  onDeleteCommand,
  onApply, 
  isProcessing,
  canApply,
  hasData,
  onUploadRequested
}) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [commands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddCommand(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-indigo-100/50 flex flex-col h-full overflow-hidden transition-all">
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transformation Logic Stack</h2>
          {hasData && (
             <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-bold border border-indigo-100 uppercase tracking-widest">Refine Mode Active</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!hasData ? (
            <button 
              onClick={onUploadRequested}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
            >
              1. Load Source Data
            </button>
          ) : (
            <button 
              onClick={onApply}
              disabled={!canApply || isProcessing}
              className={`relative overflow-hidden px-5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                canApply && !isProcessing
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Run Transformation'}
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-0 relative command-line custom-scrollbar">
        {commands.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em]">Stack Empty</p>
          </div>
        ) : (
          commands.map((cmd, idx) => (
            <div 
              key={cmd.id} 
              className={`relative z-10 pl-8 mb-4 group/item transition-all duration-300 animate-in slide-in-from-left-2 fade-in`}
            >
              <div className={`absolute left-0 top-1 w-2 h-2 rounded-full border-2 bg-white transition-all z-20 ${
                cmd.status === 'applied' ? 'border-emerald-500 bg-emerald-500' : 
                cmd.status === 'processing' ? 'border-indigo-500 animate-pulse' : 
                cmd.status === 'error' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'
              }`}></div>
              
              <div className={`px-4 py-2.5 rounded-xl border transition-all relative ${
                cmd.status === 'applied' 
                  ? 'bg-emerald-50/20 border-emerald-100' 
                  : cmd.status === 'processing'
                    ? 'bg-indigo-50/40 border-indigo-200 animate-pulse'
                    : cmd.status === 'error'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-white border-slate-100 hover:border-slate-300'
              }`}>
                {(cmd.status === 'pending' || cmd.status === 'error') && (
                  <button 
                    onClick={() => onDeleteCommand(cmd.id)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        cmd.status === 'applied' ? 'text-emerald-600' : 
                        cmd.status === 'error' ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        Step {idx + 1}
                      </span>
                    </div>
                    <p className={`text-xs font-bold ${cmd.status === 'error' ? 'text-rose-900' : 'text-slate-800'}`}>
                      {cmd.instruction}
                    </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!hasData}
            placeholder={hasData ? "Describe a refinement (e.g. 'Rename column x to y')" : "Upload a file to begin refining..."}
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit"
            disabled={!hasData || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
