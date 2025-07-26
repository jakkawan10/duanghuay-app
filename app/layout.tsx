import type { Metadata } from "next"
import { Inter, Noto_Sans_Thai } from "next/font/google"
import './globals.css';
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
})

export const metadata: Metadata = {
  title: "ดวงหวย - ระบบทำนายและวิเคราะห์เลขเด็ด",
  description: "แอปทำนายหมายเลขวิเคราะห์เลขเด็ดด้วย AI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.className} ${notoSansThai.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
