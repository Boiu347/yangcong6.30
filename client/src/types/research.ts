export type SchoolingMode = 'day' | 'boarding' | 'unknown';
export type SchoolType = 'public' | 'private' | 'international' | 'unknown';

export interface ResearchChild {
  id: string;
  birthOrder: number;
  grade: string;
  schoolingMode: SchoolingMode;
  schoolType: SchoolType;
}

export interface ResearchUserData {
  region: string;
  guardianRole: string;
  children: ResearchChild[];
  source: string;
  notes: string;
}

export interface ResearchUser {
  id: string;
  projectId: string;
  code: string;
  data: ResearchUserData;
  version: number;
  completeness: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

export interface UserHistoryEntry {
  id: string;
  changes: FieldChange[];
  updatedBy: string;
  createdAt: string;
}

export interface PortraitPersona {
  id: string;
  name: string;
  definition: string;
  distribution: string;
  educationPhilosophy: string;
  investment: string;
  decisionStyle: string;
  coreNeeds: string[];
  typicalBehaviors: string[];
  quotes: string[];
}

export interface PortraitData {
  framework: string[];
  personas: PortraitPersona[];
  source: string;
  updatedBy: string;
}

export interface PortraitSnapshot {
  projectId: string;
  data: PortraitData;
  version: number;
  updatedAt: string;
}
