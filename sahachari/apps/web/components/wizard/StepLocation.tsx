// 'use client';
// import { useWizardStore } from '../../store/useWizardStore';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// type GeoData = Record<string, Record<string, Record<string, string[]>>>;

// export default function StepLocation() {
//   const { formData, setLocation, setStep } = useWizardStore();
//   const router = useRouter();
//   const loc = formData.location;

//   const [geoData, setGeoData] = useState<GeoData>({});
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [palikas, setPalikas] = useState<string[]>([]);

//   // Load geo data once
//   useEffect(() => {
//     import('@nepalutils/nepal-geodata').then(async (m) => {
//       const data = await m.default('devnagari');
//       setGeoData(data);
//     });
//   }, []);

//   // When province changes
//   useEffect(() => {
//     if (!loc.district) return;
//     if (loc.province && geoData[loc.province]) {
//       setDistricts(Object.keys(geoData[loc.province]));
//       setPalikas([]);
//       setLocation({ ...loc, district: '', palika: '' });
//     }
//   }, [loc.province, geoData]);

//   // When district changes
//   useEffect(() => {
//     if (loc.province && loc.district && geoData[loc.province]?.[loc.district]) {
//       const districtData = geoData[loc.province][loc.district];
//       // Flatten all municipality types into one list
//       const all = [
//         ...districtData['म.न.पा.'] ?? [],
//         ...districtData['उप-म.'] ?? [],
//         ...districtData['न.पा.'] ?? [],
//         ...districtData['गा.पा.'] ?? [],
//       ];
//       setPalikas(all);
//       setLocation({ ...loc, palika: '' });
//     }
//   }, [loc.district]);

//   const handleNext = () => {
//     if (!loc.province || !loc.district || !loc.palika) {
//       return alert('प्रदेश, जिल्ला र पालिका आवश्यक छ');
//     }
//     setStep(3);
//     router.push('/wizard/3');
//   };

//   const provinces = Object.keys(geoData);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-zinc-800">ठेगाना</h2>

//       <div className="space-y-4">
//         {/* Province */}
//         <div>
//           <label className="block text-sm font-medium text-zinc-700 mb-1">प्रदेश *</label>
//           <select
//             value={loc.province}
//             onChange={e => setLocation({ ...loc, province: e.target.value, district: '', palika: '' })}
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//           >
//             <option value="">प्रदेश छान्नुहोस्</option>
//             {provinces.map(p => (
//               <option key={p} value={p}>{p}</option>
//             ))}
//           </select>
//         </div>

//         {/* District */}
//         <div>
//           <label className="block text-sm font-medium text-zinc-700 mb-1">जिल्ला *</label>
//           <select
//             value={loc.district}
//             onChange={e => setLocation({ ...loc, district: e.target.value, palika: '' })}
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//             disabled={!loc.province}
//           >
//             <option value="">जिल्ला छान्नुहोस्</option>
//             {districts.map(d => (
//               <option key={d} value={d}>{d}</option>
//             ))}
//           </select>
//         </div>

//         {/* Palika */}
//         <div>
//           <label className="block text-sm font-medium text-zinc-700 mb-1">पालिका *</label>
//           <select
//             value={loc.palika}
//             onChange={e => setLocation({ ...loc, palika: e.target.value })}
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//             disabled={!loc.district}
//           >
//             <option value="">पालिका छान्नुहोस्</option>
//             {palikas.map(p => (
//               <option key={p} value={p}>{p}</option>
//             ))}
//           </select>
//         </div>

//         {/* Ward */}
//         <div>
//           <label className="block text-sm font-medium text-zinc-700 mb-1">वडा नं. (ऐच्छिक)</label>
//           <input
//             type="number"
//             value={loc.ward}
//             onChange={e => setLocation({ ...loc, ward: e.target.value })}
//             placeholder="वडा नम्बर लेख्नुहोस्"
//             min={1}
//             max={33}
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//           />
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={() => { setStep(1); router.push('/wizard/1'); }}
//           className="flex-1 border border-zinc-300 py-3 rounded-lg text-sm"
//         >
//           ← पछाडि
//         </button>
//         <button
//           onClick={handleNext}
//           className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium"
//         >
//           अगाडि →
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';
import { useWizardStore } from '../../store/useWizardStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import geoData from '../../data/geodata.json';

type GeoData = Record<string, Record<string, Record<string, string[]>>>;
const geo = geoData as GeoData;

export default function StepLocation() {
  const { formData, setLocation, setStep } = useWizardStore();
  const router = useRouter();
  const loc = formData.location;

  const [districts, setDistricts] = useState<string[]>([]);
  const [palikas, setPalikas] = useState<string[]>([]);

  useEffect(() => {
    if (!loc.province) return;
    setDistricts(Object.keys(geo[loc.province] ?? {}));
    setPalikas([]);
  }, [loc.province]);

  useEffect(() => {
    if (!loc.district) return;
    const districtData = geo[loc.province]?.[loc.district] ?? {};
    const all = [
      ...districtData['म.न.पा.'] ?? [],
      ...districtData['उप-म.'] ?? [],
      ...districtData['न.पा.'] ?? [],
      ...districtData['गा.पा.'] ?? [],
    ];
    setPalikas(all);
  }, [loc.district, loc.province]);

  const handleNext = () => {
    if (!loc.province || !loc.district || !loc.palika) {
      alert('कृपया प्रदेश, जिल्ला र पालिका अनिवार्य रूपमा छान्नुहोस्।');
      return;
    }
    setStep(3);
    router.push('/wizard/3');
  };

  const provinces = Object.keys(geo);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ठेगाना विवरण</h2>
        <p className="text-slate-500 text-sm font-medium">घटना भएको स्थानको विवरण छान्नुहोस्</p>
      </div>

      {/* Location Form Card */}
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Province Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 tracking-tight uppercase">
            <svg className="w-4 h-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"/><path d="M2 7h20"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/></svg>
            प्रदेश *
          </label>
          <div className="relative group">
            <select
              value={loc.province}
              onChange={e => setLocation({ ...loc, province: e.target.value, district: '', palika: '' })}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none cursor-pointer"
            >
              <option value="">प्रदेश छान्नुहोस्</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* District Selection */}
        <div className={`space-y-2 transition-all duration-300 ${!loc.province ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 tracking-tight uppercase">
            <svg className="w-4 h-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            जिल्ला *
          </label>
          <div className="relative group">
            <select
              value={loc.district}
              onChange={e => setLocation({ ...loc, district: e.target.value, palika: '' })}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none cursor-pointer disabled:cursor-not-allowed"
              disabled={!loc.province}
            >
              <option value="">जिल्ला छान्नुहोस्</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Palika Selection */}
        <div className={`space-y-2 transition-all duration-300 ${!loc.district ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 tracking-tight uppercase">
            <svg className="w-4 h-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            पालिका (स्थानीय तह) *
          </label>
          <div className="relative group">
            <select
              value={loc.palika}
              onChange={e => setLocation({ ...loc, palika: e.target.value })}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none cursor-pointer disabled:cursor-not-allowed"
              disabled={!loc.district}
            >
              <option value="">पालिका छान्नुहोस्</option>
              {palikas.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Ward Number */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-black text-slate-800 tracking-tight uppercase">
            वडा नं. (ऐच्छिक)
          </label>
          <input
            type="number"
            value={loc.ward}
            onChange={e => setLocation({ ...loc, ward: e.target.value })}
            placeholder="वडा नम्बर लेख्नुहोस्"
            min={1}
            max={33}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={() => { setStep(1); router.push('/wizard/1'); }}
          className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-black text-sm py-5 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          पछाडि फर्कनुहोस्
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-slate-300 transition-all active:scale-[0.98]"
        >
          अगाडि बढ्नुहोस्
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}