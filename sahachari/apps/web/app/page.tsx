import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-violet-700 mb-2">सहचरी</h1>
      <p className="text-zinc-500 text-sm mb-8 text-center">
        घरेलु हिंसा पीडितहरूको लागि कानुनी सहायता
      </p>
      <Link
        href="/wizard/1"
        className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-lg font-medium"
      >
        सुरु गर्नुहोस् →
      </Link>
    </main>
  );
}