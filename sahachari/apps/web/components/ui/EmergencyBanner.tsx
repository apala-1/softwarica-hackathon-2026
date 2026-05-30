export default function EmergencyBanner() {
  return (
    <div className="bg-red-50 border border-red-300 rounded p-3 text-sm text-red-800 mb-4">
      <strong>आपतकालीन सहायता:</strong> महिला हेल्पलाइन{' '}
      <a href="tel:1145" className="font-bold underline">११४५</a> |
      प्रहरी <a href="tel:100" className="font-bold underline">१००</a> |
      एम्बुलेन्स <a href="tel:102" className="font-bold underline">१०२</a>
    </div>
  );
}