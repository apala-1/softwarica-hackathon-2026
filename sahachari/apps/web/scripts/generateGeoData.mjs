import nepalGeoData from '@nepalutils/nepal-geodata';

const data = await nepalGeoData('devnagari');
console.log(JSON.stringify(data, null, 2));