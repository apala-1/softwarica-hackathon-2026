import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { EnhanceRequest, Organization } from '../types/document.types';
import { findOrganizationsByLocation, buildOrgAddressBlock } from './rag.service';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `तपाईं एक विशेषज्ञ कानुनी लेखन सहायक हुनुहुन्छ। तपाईंलाई दिइएका विवरणहरूका आधारमा घरेलु हिंसा (कसूर र सजाय) ऐन, २०६६ अन्तर्गत एउटा सम्पूर्ण औपचारिक निवेदन पत्र तयार गर्नुहोस्।

निवेदन पत्रको संरचना यस प्रकार हुनुपर्छ:

१. सेवामा ब्लक (To block) — संस्थाको नाम र ठेगाना
२. विषय — एक लाइनमा
३. महोदय/महोदया सम्बोधन
४. मुख्य विवरण अनुच्छेद — सबै तथ्यहरू समावेश गरी
५. अनुरोध अनुच्छेद — कानूनी कारबाही र सुरक्षाको माग
६. धन्यवाद र समापन
७. निवेदिकाको नाम, ठेगाना, सम्पर्क नम्बर, र मिति

नियमहरू:
- पहिलो व्यक्ति (म/मैले/मलाई) मा लेख्नुहोस्
- सबै दिइएका तथ्यहरू समावेश गर्नुहोस्
- औपचारिक कानुनी नेपाली भाषा प्रयोग गर्नुहोस्
- कुनै markdown, asterisk, वा bullet points नगर्नुहोस् — सादा पाठ मात्र
- हरेक खण्ड नयाँ लाइनमा सुरु गर्नुहोस्`;

export interface GeminiEnhanceResult {
  enhancedStory: string;
  matchedOrganizations: Organization[];
}

export async function enhanceStoryWithGemini(
  input: EnhanceRequest
): Promise<GeminiEnhanceResult> {
  // RAG: find matching organizations
  const matchedOrgs = findOrganizationsByLocation(input.province, input.district);
  
  // Pick the primary org for the letter header (first match, prefer Legal Counseling)
  const primaryOrg =
    matchedOrgs.find((o) =>
      o.service_type.toLowerCase().includes('legal')
    ) || matchedOrgs[0];

  const orgBlock = primaryOrg
    ? buildOrgAddressBlock(primaryOrg)
    : `न्यायिक समिति / वडा कार्यालय\n${input.palika}${input.ward ? `, वडा नं. ${input.ward}` : ''}\n${input.district}, ${input.province}`;

  const dateLabel =
    input.dateType === 'BS'
      ? `${input.incidentDate} (बि.सं.)`
      : `${input.incidentDate} (इ.सं.)`;

  const violenceLabel =
    input.violenceTypes.length > 0
      ? input.violenceTypes.join(', ')
      : 'खुलाइएको छैन';

  const victimAddress = [input.palika, input.ward ? `वडा नं. ${input.ward}` : '', input.district, input.province]
    .filter(Boolean)
    .join(', ');

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  } as any);

  const prompt = `निम्न विवरणहरूका आधारमा सम्पूर्ण निवेदन पत्र तयार गर्नुहोस्:

--- पत्र पठाउने ठेगाना ---
${orgBlock}

--- निवेदिकाको विवरण ---
नाम: ${input.victimName}
ठेगाना: ${victimAddress}
सम्पर्क: ${input.victimPhone || 'खुलाइएको छैन'}

--- घटनाको विवरण ---
प्रतिवादी: ${input.accused}
सम्बन्ध: ${input.relationship}
हिंसाको प्रकार: ${violenceLabel}
घटनाको मिति: ${dateLabel}
घटनाको विवरण: ${input.description}

--- पत्रको मिति ---
${dateLabel}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Gemini returned empty response');
    }

    return {
      enhancedStory: text.trim(),
      matchedOrganizations: matchedOrgs,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('सर्भर त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।');
  }
}