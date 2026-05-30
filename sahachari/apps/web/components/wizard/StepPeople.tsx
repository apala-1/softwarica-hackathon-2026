'use client';
import { useWizardStore } from '../../store/useWizardStore';
import { useRouter } from 'next/navigation';
import { Person } from '../../types/wizard.types';

const RELATION_OPTIONS = [
  'श्रीमान', 'श्रीमती', 'ससुरा', 'सासू', 'देवर', 'जेठाजु',
  'नन्द', 'भाउजू', 'बुबा', 'आमा', 'दाजु', 'भाइ',
  'दिदी', 'बहिनी', 'छोरा', 'छोरी', 'अन्य',
];

function PersonForm({ title, icon, colorClass, value, onChange }: { 
  title: string; 
  icon: React.ReactNode;
  colorClass: string;
  value: Person; 
  onChange: (p: Person) => void 
}) {
  const textFields = [
    { key: 'name', label: 'नाम *', placeholder: 'पूरा नाम लेख्नुहोस्', type: 'text' },
    { key: 'phone', label: 'सम्पर्क नम्बर', placeholder: '९८XXXXXXXX', type: 'tel' },
    { key: 'address', label: 'ठेगाना', placeholder: 'स्थायी वा हालको ठेगाना', type: 'text' },
  ];

  return (
    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          {icon}
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      </div>

      <div className="space-y-5">
        {textFields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 tracking-tight">
              {label}
            </label>
            <input
              type={type}
              value={(value as any)[key] ?? ''}
              onChange={e => onChange({ ...value, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Age */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 tracking-tight">उमेर</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={120}
                value={(value as any).age ?? ''}
                onChange={e => onChange({ ...value, age: e.target.value ? Number(e.target.value) : undefined } as any)}
                placeholder="वर्ष"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 tracking-tight">लिङ्ग</label>
            <select
              value={value.gender ?? ''}
              onChange={e => onChange({ ...value, gender: e.target.value as any })}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">लिङ्ग छान्नुहोस्</option>
              <option value="female">महिला</option>
              <option value="male">पुरुष</option>
              <option value="other">अन्य</option>
            </select>
          </div>
        </div>

        {/* Relation dropdown */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700 tracking-tight">तपाईंसँगको सम्बन्ध</label>
          <select
            value={(value as any).relation ?? ''}
            onChange={e => onChange({ ...value, relation: e.target.value } as any)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="">सम्बन्ध छान्नुहोस्</option>
            {RELATION_OPTIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function StepPeople() {
  const { formData, setPeople, setStep } = useWizardStore();
  const router = useRouter();
  const people = formData.people;

  const handleNext = () => {
    if (!people.complainant.name || !people.accused.name) {
      alert('कृपया निवेदिका र प्रतिवादी दुवैको नाम अनिवार्य रूपमा भर्नुहोस्।');
      return;
    }
    setStep(6);
    router.push('/wizard/6');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          व्यक्तिहरूको विवरण
        </h2>
        <p className="text-slate-500 text-sm italic">सबै जानकारी शुद्ध र स्पष्टसँग भर्नुहोस्</p>
      </div>

      {/* Forms Container */}
      <div className="space-y-8">
        <PersonForm
          title="निवेदिका (तपाईंको विवरण)"
          colorClass="bg-indigo-600 text-white shadow-indigo-100 shadow-lg"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          value={people.complainant}
          onChange={c => setPeople({ ...people, complainant: c })}
        />

        <PersonForm
          title="प्रतिवादी (आरोपित व्यक्ति)"
          colorClass="bg-rose-600 text-white shadow-rose-100 shadow-lg"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          value={people.accused}
          onChange={a => setPeople({ ...people, accused: a })}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => { setStep(4); router.push('/wizard/4'); }}
          className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm py-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          पछाडि फर्कनुहोस्
        </button>
        <button
          onClick={handleNext}
          className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-slate-200 transition-all active:scale-[0.98]"
        >
          अगाडि बढ्नुहोस्
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
