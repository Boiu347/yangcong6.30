export interface EvidenceLink {
  title: string;
  excerpt: string;
  route: string;
  source: string;
  projectName?: string;
}

export interface KnowledgeChunk extends EvidenceLink {
  id: string;
  text: string;
  keywords: string[];
  type:
    | 'project'
    | 'summary'
    | 'qualitative'
    | 'quote'
    | 'family_interview'
    | 'profile'
    | 'learning';
}

export interface SiteAssistantResponse {
  answer: string;
  relatedLinks: EvidenceLink[];
  confidence: 'high' | 'medium' | 'low';
  refused?: boolean;
  unavailable?: boolean;
}
