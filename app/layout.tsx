'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar'; // หรือเปลี่ยนเป็น path Navbar ที่คุณใช้

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ ซ่อน Navbar บนหน้า Step 1-3
  const hideNavbarOn = ['/step1', '/step2', '/step3'];
  const isHidden = hideNavbarOn.includes(pathname);

  return (
    <html lang="th">
      <body>
        {!isHidden && <Navbar />}
        {children}
      </body>
    </html>
  );
}
