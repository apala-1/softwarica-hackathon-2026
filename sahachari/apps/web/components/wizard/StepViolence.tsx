'use client';
import { useWizardStore } from '../../store/useWizardStore';
import { useRouter } from 'next/navigation';
import violenceTypes from '../../data/violenceTypes.json';

export default function StepViolence() {
  const { formData, setViolence, setStep } = useWizardStore();
  const router = useRouter();
  const selected = formData.violence.selectedTypes;

  const toggle = (id: string) => {
    setViolence({
      selectedTypes: selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id],
    });
  };

  const handleNext = () => {
    if (selected.length === 0) {
      alert('कृपया अगाडि बढ्न कम्तीमा एक हिंसाको प्रकार छान्नुहोस्।');
      return;
    }
    setStep(5);
    router.push('/wizard/5');
  };

  // Helper for icons based on type (optional mapping for extra UX)
  const getIcon = (id: string) => {
    switch (id) {
      case 'physical_violence': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14"/><path d="M22 20H2"/><path d="M16 12h.01"/><path d="M16 8h.01"/><path d="M16 16h.01"/></svg>;
      case 'mental_violence': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M12 7v5l3 3"/></svg>;
      case 'sexual_violence': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
      case 'economic_violence': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>;
      default: return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">हिंसाको प्रकार</h2>
        <div className="inline-block bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full">
           <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">घरेलु हिंसा (कसूर र सजाय) ऐन, २०६६ अनुसार</p>
        </div>
        <p className="text-slate-500 text-sm mt-3">तपाईंले सामना गर्नुभएका विकल्पहरू छान्नुहोस् (एकभन्दा बढी छान्न सकिन्छ)</p>
      </div>

      {/* Grid List */}
      <div className="grid gap-4">
        {violenceTypes.map((v: any) => {
          const isSelected = selected.includes(v.id);
          return (
            <label 
              key={v.id} 
              className={`group relative flex items-center gap-5 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md translate-y-[-2px]' 
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
            >
              {/* Custom Checkbox */}
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(v.id)}
                  className="peer h-7 w-7 cursor-pointer appearance-none rounded-xl border-2 border-slate-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 transition-all"
                />
                <svg
                  className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1.5 top-1.5"
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

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                   <span className={`${isSelected ? "text-indigo-600" : "text-slate-400"} transition-colors`}>
                      {getIcon(v.id)}
                   </span>
                   <p className={`text-lg font-extrabold tracking-tight transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {v.nameNe}
                   </p>
                </div>
                <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isSelected ? 'text-indigo-500/70' : 'text-slate-400'}`}>
                  {v.nameEn}
                </p>
              </div>

              {/* Status Badge */}
              {isSelected && (
                <div className="hidden sm:block bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  चयन गरिएको
                </div>
              )}
            </label>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button 
          onClick={() => { setStep(3); router.push('/wizard/3'); }} 
          className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm py-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          पछाडि फर्कनुहोस्
        </button>
        <button 
          onClick={handleNext} 
          className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
        >
          अगाडि बढ्नुहोस्
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
