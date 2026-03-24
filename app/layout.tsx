import '../style.css';
import '../components/trust-logos.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anthony Leuterio | Founder & Visionary',
  description: 'Philippines\' Premier Real Estate Visionary',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
