import fs from 'fs';
import path from 'path';
import { Organization } from '../types/document.types';

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
  const normProvince = normalize(province);
  const normDistrict = normalize(district);

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