declare module '@nepalutils/nepal-geodata' {
  function nepalGeoData(type: 'devnagari' | 'english'): Promise
    Record<string, Record<string, Record<string, string[]>>>;
  export default nepalGeoData;
}