import fs from 'fs';
import path from 'path';
import { Organization } from '../types/document.types';
// Add this at the top of rag.service.ts
const NEPALI_TO_ENGLISH_DISTRICT: Record<string, string> = {
  'मोरङ': 'morang',
  'सुनसरी': 'sunsari', 
  'झापा': 'jhapa',
  'इलाम': 'ilam',
  'ताप्लेजुङ': 'taplejung',
  'पाँचथर': 'panchthar',
  'तेह्रथुम': 'tehrathum',
  'धनकुटा': 'dhankuta',
  'भोजपुर': 'bhojpur',
  'सोलुखुम्बु': 'solukhumbu',
  'ओखलढुङ्गा': 'okhaldhunga',
  'खोटाङ': 'khotang',
  'उदयपुर': 'udayapur',
  'सप्तरी': 'saptari',
  'सिरहा': 'siraha',
  'धनुषा': 'dhanusa',
  'महोत्तरी': 'mahottari',
  'सर्लाही': 'sarlahi',
  'सिन्धुली': 'sindhuli',
  'रामेछाप': 'ramechhap',
  'काभ्रेपलाञ्चोक': 'kavrepalanchok',
  'ललितपुर': 'lalitpur',
  'भक्तपुर': 'bhaktapur',
  'काठमाडौं': 'kathmandu',
  'नुवाकोट': 'nuwakot',
  'रसुवा': 'rasuwa',
  'धादिङ': 'dhading',
  'मकवानपुर': 'makwanpur',
  'रौतहट': 'rautahat',
  'बारा': 'bara',
  'पर्सा': 'parsa',
  'चितवन': 'chitwan',
  'गोरखा': 'gorkha',
  'लमजुङ': 'lamjung',
  'तनहुँ': 'tanahun',
  'स्याङ्जा': 'syangja',
  'कास्की': 'kaski',
  'मनाङ': 'manang',
  'मुस्ताङ': 'mustang',
  'म्याग्दी': 'myagdi',
  'पर्वत': 'parbat',
  'बाग्लुङ': 'baglung',
  'गुल्मी': 'gulmi',
  'पाल्पा': 'palpa',
  'नवलपरासी': 'nawalparasi',
  'रुपन्देही': 'rupandehi',
  'कपिलवस्तु': 'kapilvastu',
  'अर्घाखाँची': 'arghakhanchi',
  'प्युठान': 'pyuthan',
  'रोल्पा': 'rolpa',
  'रुकुम': 'rukum',
  'सल्यान': 'salyan',
  'दाङ': 'dang',
  'बाँके': 'banke',
  'बर्दिया': 'bardiya',
  'सुर्खेत': 'surkhet',
  'दैलेख': 'dailekh',
  'जाजरकोट': 'jajarkot',
  'डोल्पा': 'dolpa',
  'जुम्ला': 'jumla',
  'कालिकोट': 'kalikot',
  'मुगु': 'mugu',
  'हुम्ला': 'humla',
  'बाजुरा': 'bajura',
  'बझाङ': 'bajhang',
  'अछाम': 'achham',
  'डोटी': 'doti',
  'कैलाली': 'kailali',
  'कञ्चनपुर': 'kanchanpur',
  'डडेलधुरा': 'dadeldhura',
  'बैतडी': 'baitadi',
  'दार्चुला': 'darchula',
  'दोलखा': 'dolakha',
};

const NEPALI_TO_ENGLISH_PROVINCE: Record<string, string> = {
  'कोशी': 'province 1',
  'मधेश': 'province 2',
  'बागमती': 'bagmati',
  'गण्डकी': 'gandaki',
  'लुम्बिनी': 'lumbini',
  'कर्णाली': 'province 6',
  'सुदूरपश्चिम': 'sudurpashchim',
};
// Priority order for DV cases
const SERVICE_PRIORITY = [
  'legal counseling',
  'legal aid',
  'shelter',
  'gbv',
  'domestic violence',
  'psychosocial',
  'women',
];

function loadOrganizations(): Organization[] {
  const filePath = path.resolve(__dirname, '../data/wcsc.json');
  const fileContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(fileContent);
}

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreOrg(org: Organization): number {
  const serviceType = normalize(org.service_type);
  const index = SERVICE_PRIORITY.findIndex((keyword) =>
    serviceType.includes(keyword)
  );
  // Lower index = higher priority; -1 (no match) gets lowest score
  return index === -1 ? SERVICE_PRIORITY.length : index;
}

function pickBest(orgs: Organization[]): Organization[] {
  if (orgs.length === 0) return [];
  const sorted = [...orgs].sort((a, b) => scoreOrg(a) - scoreOrg(b));
  return [sorted[0]];
}

export function findOrganizationsByLocation(
  province: string,
  district: string
): Organization[] {
  const all = loadOrganizations();
  const translatedDistrict = NEPALI_TO_ENGLISH_DISTRICT[district.trim()] ?? district;
  const translatedProvince = NEPALI_TO_ENGLISH_PROVINCE[province.trim()] ?? province;
  const normProvince = normalize(translatedProvince);
  const normDistrict = normalize(translatedDistrict);
  console.log('Looking for:', { normProvince, normDistrict });
  console.log('Sample orgs in data:', all.slice(0, 3).map(o => ({
    district: normalize(o.district),
    province: normalize(o.province)
  })));
  const exact = all.filter(
    (o) =>
      normalize(o.district) === normDistrict &&
      normalize(o.province) === normProvince
  );
  if (exact.length > 0) return pickBest(exact);

  const districtOnly = all.filter(
    (o) => normalize(o.district) === normDistrict
  );
  if (districtOnly.length > 0) return pickBest(districtOnly);

  const provinceOnly = all.filter(
    (o) => normalize(o.province) === normProvince
  );
  return pickBest(provinceOnly);
}

export function buildOrgAddressBlock(org: Organization): string {
  const lines = [
    org.organization_name,
    org.local_address,
    `${org.district}, ${org.province}`,
  ];
  if (org.contact_no) lines.push(`सम्पर्क: ${org.contact_no}`);
  if (org.email) lines.push(`इमेल: ${org.email}`);
  return lines.join('\n');
}