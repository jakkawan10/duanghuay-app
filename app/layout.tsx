import './globals.css'
import Navbar from '@/components/navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DuangHuay',
  description: 'แอปดูดวง วิเคราะห์เลขเด็ด',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hiddenNavbarPaths = ['/step1', '/step2', '/step3']

  return (
    <html lang="th">
      <body>
        {/* ซ่อน Navbar เฉพาะบางหน้า */}
        {!hiddenNavbarPaths.includes(
          typeof window !== 'undefined' ? window.location.pathname : ''
        ) && <Navbar />}
        {children}
      </body>
    </html>
  )
}
