"use client";
import { useState } from "react";
import { useWizardStore } from "../../store/useWizardStore";
import { useRouter } from "next/navigation";
import { enhanceStory, generatePdf, sendEmail } from "../../lib/api";
import { Organization } from "../../types/document.types";

export default function StepReview() {
  const {
    formData,
    enhancedStory,
    matchedOrganizations,
    pdfBase64,
    setEnhancedStory,
    setMatchedOrganizations,
    setPdfBase64,
    setStory,
    setStep,
  } = useWizardStore();
  const router = useRouter();

  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const { people, location, story, violence } = formData;

  const violenceMap: Record<string, string> = {
    physical_violence: "शारीरिक हिंसा",
    mental_violence: "मानसिक हिंसा",
    sexual_violence: "यौन हिंसा",
    economic_violence: "आर्थिक हिंसा",
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      setStatus("निवेदन तयार गर्दैछ...");

      const enhanceRes = await enhanceStory({
        victimName: people.complainant.name,
        victimPhone: people.complainant.phone,
        province: location.province,
        district: location.district,
        palika: location.palika,
        ward: location.ward,
        accused: people.accused.name,
        relationship: people.accused.relation || "खुलाइएको छैन",
        violenceTypes: violence.selectedTypes.map(
          (id) => violenceMap[id] ?? id,
        ),
        description: story.rawStory,
        incidentDate: story.incidentDate,
        dateType: story.dateType,
        locale: "ne",
      });

      setEnhancedStory(enhanceRes.enhancedStory);
      setMatchedOrganizations(enhanceRes.matchedOrganizations);

      setStory({
        ...formData.story,
        enhancedStory: enhanceRes.enhancedStory,
        isEnhanced: true,
      });

      const updatedFormData = {
        ...formData,
        story: {
          ...formData.story,
          enhancedStory: enhanceRes.enhancedStory,
          isEnhanced: true,
        },
      };

      setStatus("PDF बनाउँदैछ...");
      const generateRes = await generatePdf({
        wizardData: updatedFormData,
        documentType: "nibedan",
        locale: "ne",
      });

      setPdfBase64(generateRes.pdfBase64);
      setStatus("");
    } catch (e: any) {
      console.error("Generate error:", e?.response?.data ?? e?.message ?? e);
      setStatus("त्रुटि भयो। पुनः प्रयास गर्नुहोस्।");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const bytes = atob(pdfBase64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nibedan-${people.complainant.name}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (!selectedOrg) return alert("संस्था छान्नुहोस्");
    setSending(true);
    try {
      await sendEmail({
        pdfBase64,
        enhancedStory,
        victimName: people.complainant.name,
        victimPhone: people.complainant.phone,
        organization: selectedOrg,
      });
      setEmailSent(true);
    } catch (e: any) {
      console.error("Email error:", e?.response?.data ?? e?.message ?? e);
      alert("इमेल पठाउन सकिएन। कृपया पुनः प्रयास गर्नुहोस्।");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          विवरण समीक्षा गर्नुहोस्
        </h2>
        <p className="text-slate-500 text-sm">तपाईंको निवेदन पेश गर्नु अघि अन्तिम पटक जाँच गर्नुहोस्</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">तथ्याङ्क सारांश</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Step 6 of 6</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">निवेदिका</p>
                <p className="text-slate-800 font-semibold">{people.complainant.name || "नखुलेको"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">प्रतिवादी</p>
                <p className="text-slate-800 font-semibold">{people.accused.name || "नखुलेको"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">स्थान</p>
                <p className="text-slate-800 font-semibold">{location.palika}, {location.district}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">घटना मिति</p>
                <p className="text-slate-800 font-semibold">{story.incidentDate} ({story.dateType})</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">हिंसाको प्रकार</p>
           <div className="flex flex-wrap gap-2">
              {violence.selectedTypes.map((id) => (
                <span key={id} className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium shadow-sm">
                  {violenceMap[id] ?? id}
                </span>
              ))}
           </div>
        </div>
      </div>

      {/* AI Enhanced Story Preview */}
      {enhancedStory && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white border border-violet-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-violet-600 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <p className="text-sm font-bold text-violet-800">AI द्वारा तयार पारिएको कानुनी मस्यौदा</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 max-h-60 overflow-y-auto border border-slate-100 shadow-inner">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {enhancedStory}
              </pre>
            </div>
            <p className="mt-3 text-[10px] text-slate-400 italic text-center">तपाईंको विवरणको आधारमा स्वचालित रूपमा भाषा मिलाइएको छ</p>
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="space-y-4">
        {!pdfBase64 ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full relative group overflow-hidden bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-lg disabled:shadow-none"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {status}
              </span>
            ) : (
              "निवेदन तयार गर्नुहोस्"
            )}
          </button>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3">
               <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-emerald-200 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
               <div>
                 <h3 className="font-bold text-emerald-900 text-lg">निवेदन सफलतापूर्वक तयार भयो!</h3>
                 <p className="text-emerald-700/70 text-sm">अब तपाईं यसलाई डाउनलोड गर्न वा सम्बन्धित संस्थामा पठाउन सक्नुहुन्छ।</p>
               </div>
               <button
                  onClick={handleDownload}
                  className="mt-2 flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  PDF डाउनलोड गर्नुहोस्
                </button>
            </div>

            {/* Organization Selection */}
            {matchedOrganizations.length > 0 && !emailSent && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                  सहायताका लागि संस्था छान्नुहोस्
                </h4>
                
                <div className="grid gap-3">
                  {matchedOrganizations.map((org, i) => (
                    <label
                      key={i}
                      onClick={() => setSelectedOrg(org)}
                      className={`group relative flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
                            ${
                              selectedOrg?.organization_name === org.organization_name
                                ? "border-indigo-600 bg-indigo-50/50 shadow-md translate-y-[-2px]"
                                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedOrg?.organization_name === org.organization_name ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}
                      `}>
                         {selectedOrg?.organization_name === org.organization_name && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{org.organization_name}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {org.local_address}, {org.district}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded uppercase">{org.service_type}</span>
                          {org.contact_no && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              📞 {org.contact_no}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleSendEmail}
                  disabled={sending || !selectedOrg}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.99]"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      पठाउँदैछ...
                    </span>
                  ) : (
                    "📧 इमेल पठाउनुहोस्"
                  )}
                </button>
              </div>
            )}

            {emailSent && (
              <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg flex items-center gap-4 animate-in slide-in-from-top-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
                <div>
                  <h4 className="font-bold">सफलतापूर्वक पठाइयो!</h4>
                  <p className="text-xs text-white/80">संस्थाले तपाईंको निवेदन प्राप्त गरेको छ।</p>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                setPdfBase64("");
                setEnhancedStory("");
                setEmailSent(false);
                setSelectedOrg(null);
              }}
              className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs transition-colors"
            >
              विवरण सच्याउनुहोस् वा पुनः तयार गर्नुहोस्
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-6">
        <button
          onClick={() => {
            setStep(5);
            router.push("/wizard/5");
          }}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm py-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          पछाडि फर्कनुहोस्
        </button>
      </div>
    </div>
  );
}