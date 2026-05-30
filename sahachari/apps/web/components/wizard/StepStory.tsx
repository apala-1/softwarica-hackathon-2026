'use client';
import { useState, useRef, useEffect } from 'react';
import { useWizardStore } from '../../store/useWizardStore';
import { useRouter } from 'next/navigation';

// --- BS calendar data (EXACTLY AS PROVIDED) ---
const BS_MONTHS = ['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पौष','माघ','फाल्गुन','चैत्र'];
const AD_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_NP = ['आ','सो','मं','बु','बि','शु','श'];
const DAYS_EN = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const BS_DATA: Record<number, number[]> = {
  2078:[30,32,31,32,31,30,30,30,29,29,30,29],
  2079:[31,31,32,31,31,31,30,29,30,29,30,30],
  2080:[31,32,31,32,31,30,30,30,29,30,29,31],
  2081:[31,31,32,31,31,30,30,29,30,29,30,30],
  2082:[31,32,31,32,31,30,30,30,29,30,29,31],
  2083:[31,31,32,31,31,31,30,29,30,29,30,30],
};

function bsToAd(y: number, m: number, d: number): Date {
  const refAd = new Date(2021, 3, 14);
  let total = d - 1;
  for (let yr = 2078; yr < y; yr++)
    (BS_DATA[yr] ?? Array(12).fill(30)).forEach(x => (total += x));
  for (let mo = 1; mo < m; mo++) total += (BS_DATA[y] ?? [])[mo - 1] ?? 30;
  const ad = new Date(refAd);
  ad.setDate(ad.getDate() + total);
  return ad;
}

function daysInMonth(mode: 'BS' | 'AD', y: number, m: number) {
  if (mode === 'BS') return (BS_DATA[y] ?? [])[m - 1] ?? 30;
  return new Date(y, m, 0).getDate();
}

function firstDayOfWeek(mode: 'BS' | 'AD', y: number, m: number) {
  if (mode === 'BS') return bsToAd(y, m, 1).getDay();
  return new Date(y, m - 1, 1).getDay();
}

// --- Redesigned Calendar component ---
function DatePickerCalendar({
  onSelect,
}: {
  onSelect: (date: string, type: 'BS' | 'AD') => void;
}) {
  const [mode, setMode] = useState<'BS' | 'AD'>('BS');
  const [viewY, setViewY] = useState(2081);
  const [viewM, setViewM] = useState(1);
  const [selY, setSelY] = useState<number | null>(null);
  const [selM, setSelM] = useState<number | null>(null);
  const [selD, setSelD] = useState<number | null>(null);

  const switchMode = (m: 'BS' | 'AD') => {
    setMode(m);
    setSelD(null);
    if (m === 'AD') {
      const now = new Date();
      setViewY(now.getFullYear());
      setViewM(now.getMonth() + 1);
    } else {
      setViewY(2081); setViewM(1);
    }
  };

  const pick = (d: number) => { setSelD(d); setSelY(viewY); setSelM(viewM); };

  const confirm = () => {
    if (!selD || !selY || !selM) return;
    const date = `${selY}-${String(selM).padStart(2,'0')}-${String(selD).padStart(2,'0')}`;
    onSelect(date, mode);
  };

  const now = new Date();
  const title = mode === 'BS'
    ? `${BS_MONTHS[viewM - 1]} ${viewY}`
    : `${AD_MONTHS[viewM - 1]} ${viewY}`;
  const days = daysInMonth(mode, viewY, viewM);
  const first = firstDayOfWeek(mode, viewY, viewM);
  const labels = mode === 'BS' ? DAYS_NP : DAYS_EN;

  return (
    <div className="absolute top-full left-0 mt-3 z-<sup>100</sup> bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-2xl w-80 animate-in zoom-in-95 duration-200">
      {/* Mode toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
        {(['BS','AD'] as const).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {m === 'BS' ? 'बि.सं. (BS)' : 'इ.सं. (AD)'}
          </button>
        ))}
      </div>

      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={() => { if (viewM === 1) { setViewM(12); setViewY(y => y - 1); } else setViewM(m => m - 1); }}
          className="w-9 h-9 flex items-center justify-center border-2 border-slate-50 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="text-sm font-extrabold text-slate-900 tracking-tight">{title}</span>
        <button onClick={() => { if (viewM === 12) { setViewM(1); setViewY(y => y + 1); } else setViewM(m => m + 1); }}
          className="w-9 h-9 flex items-center justify-center border-2 border-slate-50 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {labels.map(l => (
          <div key={l} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">{l}</div>
        ))}
        {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map(d => {
          const isSel = selD === d && selY === viewY && selM === viewM;
          const isToday = mode === 'AD' && viewY === now.getFullYear() && viewM === now.getMonth() + 1 && d === now.getDate();
          return (
            <button key={d} onClick={() => pick(d)}
              className={`group relative text-center text-sm py-2 rounded-xl transition-all font-bold
                ${isSel 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : isToday 
                    ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                    : 'text-slate-700 hover:bg-slate-100'}`}>
              {d}
              {isToday && !isSel && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          );
        })}
      </div>

      <button onClick={confirm}
        disabled={!selD}
        className="mt-5 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-slate-100">
        ठीक छ
      </button>
    </div>
  );
}

// --- Main Redesigned Step ---
export default function StepStory() {
  const { formData, setStory, setStep } = useWizardStore();
  const router = useRouter();
  const story = formData.story;
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDateSelect = (date: string, type: 'BS' | 'AD') => {
    setStory({ ...story, incidentDate: date, dateType: type });
    setCalOpen(false);
  };

  const handleNext = () => {
    if (!story.rawStory || !story.incidentDate) {
      alert('कृपया घटनाको विवरण र मिति दुवै अनिवार्य रूपमा भर्नुहोस्।');
      return;
    }
    setStep(4);
    router.push('/wizard/4');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">घटनाको विवरण</h2>
        <p className="text-slate-500 text-sm">भएको घटनाको बारेमा केही जानकारी दिनुहोस्</p>
      </div>

      <div className="space-y-6">
        {/* Date picker Section */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 tracking-tight">घटना भएको मिति *</label>
          <div className="relative" ref={calRef}>
            <button 
              onClick={() => setCalOpen(o => !o)}
              className={`w-full flex items-center justify-between border-2 rounded-2xl px-5 py-4 text-sm transition-all outline-none bg-white
                ${calOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${story.incidentDate ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                {story.incidentDate
                  ? <span className="text-slate-900 font-bold">{story.incidentDate} <span className="text-indigo-600 ml-1">({story.dateType === 'BS' ? 'बि.सं.' : 'इ.सं.'})</span></span>
                  : <span className="text-slate-400 font-medium">मिति छान्नुहोस्</span>}
              </div>
              <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${calOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {calOpen && <DatePickerCalendar onSelect={handleDateSelect} />}
          </div>
        </div>

        {/* Story textarea Section */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 tracking-tight">के भएको थियो? विस्तृत रूपमा लेख्नुहोस् *</label>
          <div className="relative group">
            <textarea
              value={story.rawStory}
              onChange={e => setStory({ ...story, rawStory: e.target.value, isEnhanced: false })}
              rows={8}
              placeholder="घटना कसरी भयो, कहाँ भयो र को संलग्न थियो भन्ने कुरा यहाँ लेख्नुहोस्..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none leading-relaxed"
            />
            <div className="absolute bottom-4 right-5 flex items-center gap-2">
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${story.rawStory.length > 4000 ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                {story.rawStory.length} / 5000
               </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">तपाईंले आफ्नो मातृभाषामा लेख्न सक्नुहुन्छ, AI ले यसलाई कानुनी ढाँचामा मिलाउन मद्दत गर्नेछ।</p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={() => { setStep(2); router.push('/wizard/2'); }}
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
