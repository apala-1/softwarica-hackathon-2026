'use client';
import { useWizardStore } from '../../store/useWizardStore';
import { useRouter } from 'next/navigation';
import EmergencyBanner from '../ui/EmergencyBanner';

export default function StepSafety() {
  const { formData, setSafety, setStep } = useWizardStore();
  const router = useRouter();
  const safety = formData.safety;

  const handleNext = () => {
    setStep(2);
    router.push('/wizard/2');
  };

  const safetyQuestions = [
    { 
      key: 'inImmediateDanger', 
      label: 'के तपाईं अहिले तत्काल खतरामा हुनुहुन्छ?', 
      description: 'तपाईंको भौतिक सुरक्षा जोखिममा छ भने कृपया हो भन्नुहोस्।',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    },
    { 
      key: 'hasChildren', 
      label: 'के घरमा बच्चाहरू छन्?', 
      description: 'बालबालिकाको सुरक्षा सुनिश्चित गर्न यो जानकारी आवश्यक छ।',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      key: 'isSafeToContact', 
      label: 'के तपाईंलाई सम्पर्क गर्न सुरक्षित छ?', 
      description: 'हामीले पछि सम्पर्क गर्दा कसैले थाहा पाउने जोखिम छ?',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <EmergencyBanner />
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">सुरक्षा जाँच</h2>
        <p className="text-slate-500 text-sm">तपाईंको अहिलेको अवस्थाबारे स्पष्ट जानकारी दिनुहोस्</p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {safetyQuestions.map(({ key, label, description, icon }) => {
          const isChecked = !!safety[key as keyof typeof safety];
          return (
            <label 
              key={key} 
              className={`group flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
                ${isChecked 
                  ? "border-indigo-600 bg-indigo-50/50 shadow-md translate-y-[-2px]" 
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                }`}
            >
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e => setSafety({ ...safety, [key]: e.target.checked })}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 transition-all"
                />
                <svg
                  className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1 top-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`${isChecked ? "text-indigo-600" : "text-slate-400"} transition-colors`}>
                    {icon}
                  </span>
                  <p className={`font-bold tracking-tight transition-colors ${isChecked ? "text-indigo-900" : "text-slate-800"}`}>
                    {label}
                  </p>
                </div>
                <p className={`text-xs leading-relaxed transition-colors ${isChecked ? "text-indigo-700/70" : "text-slate-500"}`}>
                  {description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Immediate Danger Warning */}
      {safety.inImmediateDanger && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 shadow-lg shadow-rose-100 animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white flex-shrink-0 animate-pulse shadow-lg shadow-rose-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-black text-rose-900 leading-tight">तुरुन्त सहयोग लिनुहोस्!</h4>
                <p className="text-rose-700 font-medium text-sm mt-1">तपाईंको सुरक्षा हाम्रो पहिलो प्राथमिकता हो।</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="tel:100" className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]">
                  📞 प्रहरी (१००)
                </a>
                <a href="tel:1145" className="flex items-center justify-center gap-2 bg-white border-2 border-rose-600 text-rose-600 py-3 rounded-xl font-bold transition-all hover:bg-rose-50 active:scale-[0.98]">
                  📞 हेल्पलाइन (११४५)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button 
        onClick={handleNext} 
        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3"
      >
        अगाडि बढ्नुहोस्
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Progress Disclaimer */}
      <p className="text-center text-[11px] text-slate-400 font-medium">
        तपाईंको गोपनीयता सुरक्षित छ। यो एप्लिकेसनले डेटा सुरक्षित रूपमा ह्यान्डल गर्छ।
      </p>
    </div>
  );
}