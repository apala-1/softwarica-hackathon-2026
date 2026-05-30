import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WizardFormData } from '../types/wizard.types';
import { Organization } from '../types/document.types';

interface WizardStore {
  currentStep: number;
  formData: WizardFormData;
  enhancedStory: string;
  matchedOrganizations: Organization[];
  pdfBase64: string;
  setStep: (step: number) => void;
  setSafety: (data: WizardFormData['safety']) => void;
  setLocation: (data: WizardFormData['location']) => void;
  setStory: (data: WizardFormData['story']) => void;
  setViolence: (data: WizardFormData['violence']) => void;
  setPeople: (data: WizardFormData['people']) => void;
  setEnhancedStory: (story: string) => void;
  setMatchedOrganizations: (orgs: Organization[]) => void;
  setPdfBase64: (pdf: string) => void;
  reset: () => void;
}

const initialFormData: WizardFormData = {
  safety: { inImmediateDanger: false, hasChildren: false, isSafeToContact: false },
  location: { province: '', district: '', palika: '', ward: '' },
  story: { rawStory: '', enhancedStory: '', isEnhanced: false, incidentDate: '', dateType: 'BS' },
  violence: { selectedTypes: [] },
  people: {
    complainant: { name: '' },
    accused: { name: '' },
    witnesses: [],
  },
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,
      enhancedStory: '',
      matchedOrganizations: [],
      pdfBase64: '',
      setStep: (step) => set({ currentStep: step }),
      setSafety: (data) => set(s => ({ formData: { ...s.formData, safety: data } })),
      setLocation: (data) => set(s => ({ formData: { ...s.formData, location: data } })),
      setStory: (data) => set(s => ({ formData: { ...s.formData, story: data } })),
      setViolence: (data) => set(s => ({ formData: { ...s.formData, violence: data } })),
      setPeople: (data) => set(s => ({ formData: { ...s.formData, people: data } })),
      setEnhancedStory: (story) => set({ enhancedStory: story }),
      setMatchedOrganizations: (orgs) => set({ matchedOrganizations: orgs }),
      setPdfBase64: (pdf) => set({ pdfBase64: pdf }),
      reset: () => set({ currentStep: 1, formData: initialFormData, enhancedStory: '', matchedOrganizations: [], pdfBase64: '' }),
    }),
    { name: 'sahachari-wizard' }
  )
);