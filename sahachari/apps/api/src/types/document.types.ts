export type DocumentType = 'nibedan';
export type Locale = 'ne';

export interface EnhanceRequest {
  // Victim info
  victimName: string;
  victimPhone?: string;

  // Location
  province: string;
  district: string;
  palika: string;
  ward?: string;

  // Incident
  accused: string;
  relationship: string;
  violenceTypes: string[];
  description: string;
  incidentDate: string;
  dateType: 'BS' | 'AD';

  locale: Locale;
}

export interface EnhanceResponse {
  enhancedStory: string;         // full formatted letter
  matchedOrganizations: Organization[];  // for frontend to display
}

export interface Organization {
  organization_name: string;
  service_type: string;
  contact_no: string;
  email: string;
  website: string;
  province: string;
  district: string;
  local_address: string;
  source_url: string;
  description: string;
}

export interface GenerateRequest {
  wizardData: import('./wizard.types').WizardFormData;
  documentType: DocumentType;
  locale: Locale;
}

export interface GenerateResponse {
  pdfBase64: string;
  sessionId: string;
}