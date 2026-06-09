export interface ResearchChild {
  id: string;
  birthOrder: number;
  grade: string;
  schoolingMode: 'day' | 'boarding' | 'unknown';
  schoolType: 'public' | 'private' | 'international' | 'unknown';
}

export interface ResearchUserData {
  region: string;
  guardianRole: string;
  children: ResearchChild[];
  source: string;
  notes: string;
}

export interface FieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

export interface PortraitSnapshotData {
  framework: string[];
  personas: unknown[];
  source: string;
  updatedBy: string;
}
