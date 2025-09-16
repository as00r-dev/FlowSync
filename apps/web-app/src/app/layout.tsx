import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowSync AI',
  description: 'The Verifiable Coordination Layer for Modern Product Teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}