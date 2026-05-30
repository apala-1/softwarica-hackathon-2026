import { WizardFormData } from "./wizard.types";

export type DocumentType = 'nibedan' | 'protectionOrder' | 'evidenceChecklist';

export type Locale = 'ne' | 'en';

export interface GenerateRequest {
  wizardData: WizardFormData;  // import from wizard.types
  documentType: DocumentType;
  locale: Locale;
}

export interface EnhanceRequest {
  rawStory: string;
  locale: Locale;
}

export interface GenerateResponse {
  pdfBase64: string;
  sessionId: string;
}

export interface EnhanceResponse {
  enhancedStory: string;
}