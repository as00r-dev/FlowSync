import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'FlowSync AI - Engineering Intelligence Platform',
  description: 'Eliminate manual status updates while ensuring every AI-generated insight is auditable, explainable, and compliant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}