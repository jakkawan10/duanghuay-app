// app/layout.tsx
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ดวงหวย',
  description: 'แอปทำนายดวงและเลขเด็ด'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
