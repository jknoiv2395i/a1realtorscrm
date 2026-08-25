import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A1 CRM - Luxury & Commercial Real Estate CRM (India)',
  description: 'Production-ready Real Estate CRM tailored for the Indian property market with RERA compliance, Stamp Duty calculators, and Lead Kanban.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
