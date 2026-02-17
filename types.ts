
export interface DataRow {
  [key: string]: any;
}

export interface Command {
  id: string;
  instruction: string;
  status: 'pending' | 'processing' | 'applied' | 'error';
  timestamp: number;
  explanation?: string;
  targetColumns?: string[];
}

export interface DatasetState {
  filename: string;
  headers: string[];
  rows: DataRow[];
}

export interface HistoryItem {
  state: DatasetState;
  appliedCommand?: Command;
}

export type TransformationType = 'RENAME_COLUMN' | 'MAP_VALUES' | 'FILTER' | 'EXTRACT' | 'FORMAT' | 'CUSTOM';

export interface TransformationStep {
  type: TransformationType;
  description: string;
  jsLogic: string; // JavaScript code to be executed on rows
}
