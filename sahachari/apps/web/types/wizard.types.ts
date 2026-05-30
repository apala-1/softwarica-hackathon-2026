export interface Person {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  relation?: string;
  phone?: string;
}

export interface SafetyStepData {
  inImmediateDanger: boolean;
  hasChildren: boolean;
  isSafeToContact: boolean;
}

export interface LocationStepData {
  province: string;
  district: string;
  palika: string;
  ward: string;
}

export interface StoryStepData {
  rawStory: string;
  enhancedStory: string;
  isEnhanced: boolean;
}

export interface ViolenceStepData {
  selectedTypes: string[];
}

export interface PeopleStepData {
  complainant: Person;
  accused: Person;
  witnesses: Person[];
}

export interface WizardFormData {
  safety: SafetyStepData;
  location: LocationStepData;
  story: StoryStepData;
  violence: ViolenceStepData;
  people: PeopleStepData;
}