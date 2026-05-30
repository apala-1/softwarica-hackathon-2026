import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'सहचरी',
  description: 'घरेलु हिंसा कानुनी सहायता',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}