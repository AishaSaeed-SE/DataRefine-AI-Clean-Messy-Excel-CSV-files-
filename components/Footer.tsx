
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-8 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2025 DataRefine AI Studio</p>
      </div>
      <div className="flex items-center gap-2">
         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Engines Operational</span>
      </div>
    </footer>
  );
};
