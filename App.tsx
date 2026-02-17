
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { CommandConsole } from './components/console/CommandConsole';
import { DataWorkspace } from './components/ledger/DataWorkspace';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { LedgerPage } from './components/ledger/LedgerPage';
import { Command, DatasetState, HistoryItem, DataRow } from './types';
import { interpretCommand } from './geminiService';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'ledger'>('editor');
  
  const mainScrollRef = useRef<HTMLElement>(null);

  const currentState = useMemo(() => {
    if (history.length === 0) return null;
    return history[history.length - 1].state;
  }, [history]);

  const resetData = useCallback(() => {
    // Clear all session states immediately to trigger Hero view
    setHistory([]);
    setCommands([]);
    setError(null);
    setView('editor');
    
    // Anchor to home/top
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) return;
      if (file.name.endsWith('.csv')) {
        (window as any).Papa.parse(result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const state: DatasetState = {
              filename: file.name,
              headers: results.meta.fields || [],
              rows: results.data as DataRow[],
            };
            setHistory([{ state }]);
            setIsLoading(false);
            setView('editor');
          },
          error: (err: any) => {
            setError(`Error parsing CSV: ${err.message}`);
            setIsLoading(false);
          }
        });
      } else {
        try {
          const workbook = (window as any).XLSX.read(result, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = (window as any).XLSX.utils.sheet_to_json(firstSheet);
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0] as object) : [];
          const state: DatasetState = {
            filename: file.name,
            headers,
            rows: jsonData as DataRow[],
          };
          setHistory([{ state }]);
          setIsLoading(false);
          setView('editor');
        } catch (err: any) {
          setError(`Error parsing Excel: ${err.message}`);
          setIsLoading(false);
        }
      }
    };
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }, []);

  const addCommand = useCallback((instruction: string) => {
    const newCommand: Command = {
      id: crypto.randomUUID(),
      instruction,
      status: 'pending',
      timestamp: Date.now(),
    };
    setCommands(prev => [...prev, newCommand]);
  }, []);

  const deleteCommand = useCallback((id: string) => {
    setCommands(prev => prev.filter(c => c.id !== id));
  }, []);

  const applyCommands = useCallback(async () => {
    if (!currentState) return;
    setIsLoading(true);
    setError(null);
    let workingState = { ...currentState };
    const pendingCommands = commands.filter(c => c.status === 'pending' || c.status === 'error');

    try {
      for (const cmd of pendingCommands) {
        setCommands(prev => prev.map(c => c.id === cmd.id ? { ...c, status: 'processing', explanation: undefined } : c));
        const sampleRows = workingState.rows.slice(0, 10);
        const transformation = await interpretCommand(cmd.instruction, sampleRows, workingState.headers);
        const transformFn = new Function('row', 'index', 'allRows', `
          try {
            ${transformation.jsLogic.includes('return') ? transformation.jsLogic : 'return ' + transformation.jsLogic}
          } catch (e) {
            return row;
          }
        `);
        const newRows = workingState.rows
          .map((row, idx) => transformFn(row, idx, workingState.rows))
          .filter(row => row !== null && typeof row === 'object');

        if (newRows.length === 0 && workingState.rows.length > 0) {
           throw new Error("Transformation resulted in an empty dataset.");
        }
        const firstRow = newRows[0];
        const newHeaders = (firstRow && typeof firstRow === 'object') ? Object.keys(firstRow) : workingState.headers;
        workingState = { ...workingState, rows: newRows, headers: newHeaders };
        setCommands(prev => prev.map(c => c.id === cmd.id ? { ...c, status: 'applied', explanation: transformation.description } : c));
        setHistory(prev => [...prev, { state: workingState, appliedCommand: cmd }]);
      }
    } catch (err: any) {
      setCommands(prev => prev.map(c => c.status === 'processing' ? { ...c, status: 'error', explanation: err.message } : c));
      setError(`Interrupted: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [commands, currentState]);

  const undoLast = useCallback(() => {
    if (history.length <= 1) return;
    const lastHistory = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (lastHistory.appliedCommand) {
       setCommands(prev => prev.map(c => c.id === lastHistory.appliedCommand?.id ? { ...c, status: 'pending' } : c));
    }
  }, [history]);

  const handleTabChange = useCallback((tab: 'NEW' | 'PROCESSING' | 'STUDIO') => {
    if (tab === 'NEW') {
      resetData();
    } else if (tab === 'PROCESSING') {
      if (currentState) setView('editor');
    } else if (tab === 'STUDIO') {
      if (currentState) setView('ledger');
    }
  }, [currentState, resetData]);

  const getActiveTab = () => {
    if (!currentState) return 'NEW';
    if (view === 'ledger') return 'STUDIO';
    return 'PROCESSING';
  };

  if (view === 'ledger' && currentState) {
    return (
      <LedgerPage 
        data={currentState} 
        onRefine={() => setView('editor')} 
        onNewUpload={resetData} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      <Header 
        onReset={resetData} 
        onUndo={undoLast} 
        canUndo={history.length > 1}
        datasetName={currentState?.filename}
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
      
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto custom-scrollbar force-scrollbar bg-[#F8FAFC]">
        <div className="min-h-full flex flex-col px-6 pb-6 gap-6 relative">
          {!currentState ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] py-12">
               <Hero onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>
          ) : (
            <>
              <section className="h-[30%] min-h-[220px] pt-4 shrink-0">
                <CommandConsole 
                  commands={commands}
                  onAddCommand={addCommand}
                  onDeleteCommand={deleteCommand}
                  onApply={applyCommands}
                  isProcessing={isLoading}
                  canApply={commands.some(c => c.status === 'pending' || c.status === 'error')}
                  hasData={!!currentState}
                  onUploadRequested={resetData}
                />
              </section>

              <section className="h-[60%] min-h-[400px] overflow-hidden shrink-0">
                <DataWorkspace 
                  data={currentState}
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  error={error}
                  onViewLedger={() => setView('ledger')}
                />
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
