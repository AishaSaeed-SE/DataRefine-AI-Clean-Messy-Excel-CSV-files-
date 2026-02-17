
import React from 'react';
import { DatasetState } from '../../types';
import { LedgerView } from './LedgerView';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface LedgerPageProps {
  data: DatasetState;
  onRefine: () => void;
  onNewUpload: () => void;
}

export const LedgerPage: React.FC<LedgerPageProps> = ({ data, onRefine, onNewUpload }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <Header 
        onReset={onNewUpload} 
        onUndo={() => {}} 
        canUndo={false} 
        datasetName={data.filename}
        activeTab="STUDIO"
        onTabChange={(tab) => {
          if (tab === 'PROCESSING') onRefine();
          if (tab === 'NEW') onNewUpload();
        }}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden px-8 py-6 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Sub-Header matching screenshot */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Dataset Ledger</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Production Grade Output</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{data.rows.length.toLocaleString()} Validated Rows</span>
               </div>
               <div className="h-6 w-px bg-slate-200"></div>
               <button 
                onClick={onRefine}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                 Refine Selection
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <LedgerView headers={data.headers} rows={data.rows} />
          </div>

          <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Workspace ID: {data.filename.toUpperCase().replace(/\W/g, '_')}</span>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Engine</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
