export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Dimension = '启蒙认知' | '购买决策' | '产品体验';
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type FileCategory = 'audio' | 'document';

export const DIMENSIONS: Dimension[] = ['启蒙认知', '购买决策', '产品体验'];

export interface VOCItem {
  id: string;
  brand: string;
  text: string;
  respondent?: string;
  sentiment: Sentiment;
  dimension: string;
  subDimension?: string;
  startTime?: number;
  endTime?: number;
  clipUrl?: string;
  sourceFileId: string;
  sourceFileName: string;
}

export interface ProjectFile {
  id: string;
  name: string; // original filename = source label
  category: FileCategory;
  status: FileStatus;
  errorMessage?: string;
  vocList: VOCItem[];
  audioUrl?: string;
  uploadedAt: number;
}

export interface BrandReport {
  brand: string;
  coreFindings: string[];
  typicalAttitudes: string[];
  strengths: string[];
  painPoints: string[];
}

export interface SummaryData {
  coreFindings: string[];
  actionItems: string[];
  methodology: string;
  generatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  files: ProjectFile[];
  summaryData?: SummaryData;
  brandReports?: Record<string, BrandReport>;
  /** 项目类别，如「新课定位」「用户画像」 */
  category?: string;
  /** 协同团队，如「策略」「销售」 */
  team?: string[];
  /** 研究方法，如「桌面研究」「定量调研」「定性调研」 */
  methods?: string[];
  /** 项目状态 */
  status?: '进行中' | '已完成' | '部分完成';
  /** 调研周期，如「2026Q2」 */
  quarter?: string;
}

/** Strip file extension from filename */
export function fileLabel(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

/** Normalize legacy dimension values */
export function normalizeDimension(dim: string): string {
  if (dim === '需求认知') return '启蒙认知';
  return dim;
}
