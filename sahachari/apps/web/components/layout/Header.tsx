import QuickExitButton from '../ui/QuickExitButton';
export default function Header() {
  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-violet-700">सहचरी</h1>
        <p className="text-xs text-zinc-500">घरेलु हिंसा कानुनी सहायता</p>
      </div>
      <QuickExitButton />
    </header>
  );
}