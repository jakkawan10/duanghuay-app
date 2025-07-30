import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { auth } from '@/lib/firebase'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ดวงหวย',
  description: 'แอปดูดวงวิเคราะห์เลขเด็ด',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser

  return (
    <html lang="th">
      <body className={inter.className}>
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <Link href="/home">
            <span className="text-xl font-bold text-orange-500">🔮 ดวงหวย</span>
          </Link>
          {!user && (
            <div className="flex gap-2">
              <Link href="/auth">
                <button className="px-4 py-1 border rounded">เข้าสู่ระบบ</button>
              </Link>
              <Link href="/auth?tab=register">
                <button className="px-4 py-1 bg-yellow-400 text-white rounded">สมัครสมาชิก</button>
              </Link>
            </div>
          )}
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}
