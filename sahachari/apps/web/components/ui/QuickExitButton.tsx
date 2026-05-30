'use client';
export default function QuickExitButton() {
  const handleExit = () => {
    localStorage.clear();
    window.location.href = 'https://www.google.com';
  };
  return (
    <button
      onClick={handleExit}
      className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded shadow-lg"
    >
      छिटो बाहिर निक्नुस् ✕
    </button>
  );
}