
import React from 'react';
import { DataRow } from '../../types';

interface LedgerViewProps {
  headers: string[];
  rows: DataRow[];
}

export const LedgerView: React.FC<LedgerViewProps> = ({ headers, rows }) => {
  return (
    <div className="h-full w-full overflow-auto bg-white custom-scrollbar">
      <table className="min-w-full border-separate border-spacing-0 table-fixed">
        <thead className="sticky top-0 z-30">
          <tr>
            <th className="px-4 py-3.5 border-b border-r border-slate-200 bg-slate-100 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-16 sticky left-0 z-40 shadow-[2px_0_0_0_rgba(0,0,0,0.05)]">
              IDX
            </th>
            {headers.map((header) => (
              <th 
                key={header} 
                className="px-6 py-3.5 border-b border-r border-slate-200 bg-slate-100 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-widest min-w-[220px] hover:bg-slate-200 transition-colors cursor-default select-none z-30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate" title={header}>{header}</span>
                  <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="group hover:bg-indigo-50/40 transition-colors">
              <td className="px-4 py-3 border-r border-slate-200 bg-slate-50 group-hover:bg-indigo-100/30 text-center text-[10px] font-bold text-slate-400 mono sticky left-0 z-20 transition-colors shadow-[2px_0_0_0_rgba(0,0,0,0.05)]">
                {(rowIndex + 1).toString().padStart(4, '0')}
              </td>
              {headers.map((header) => {
                const value = row[header];
                const isNull = value === null || value === undefined || value === '';
                return (
                  <td 
                    key={`${rowIndex}-${header}`} 
                    className={`px-6 py-3 border-r border-slate-100 text-xs font-medium mono transition-all ${
                      isNull ? 'text-slate-300 italic bg-slate-50/20' : 'text-slate-700'
                    }`}
                  >
                    <div className="truncate max-w-[400px]" title={String(value)}>
                      {isNull ? 'empty' : String(value)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-slate-50/50">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
             <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
             </svg>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No data matching current filters</p>
        </div>
      )}
    </div>
  );
};
