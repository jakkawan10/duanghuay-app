import Navbar from '@/components/navbar'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname === '/' ||
                     pathname === '/login' ||
                     pathname === '/register' ||
                     pathname.startsWith('/step');

  return (
    <html lang="th">
      <body>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
