'use client';
import { useWizardStore } from '../../store/useWizardStore';

const STEPS = [
  'सुरक्षा',
  'ठेगाना',
  'घटना',
  'हिंसाको प्रकार',
  'व्यक्तिहरू',
  'समीक्षा',
];

export default function WizardShell({ children }: { children: React.ReactNode }) {
  const currentStep = useWizardStore(s => s.currentStep);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${currentStep === i + 1 ? 'bg-violet-600 text-white' :
                currentStep > i + 1 ? 'bg-violet-200 text-violet-700' :
                'bg-zinc-100 text-zinc-400'}`}>
              {i + 1}
            </div>
            <span className="text-xs text-zinc-500 hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}