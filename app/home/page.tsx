// app/home/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          const ritual = data.ritualStatus || {}

          if (!ritual.step1 || !ritual.step2 || !ritual.step3) {
            router.push('/login') // fallback ถ้า ritual ไม่ครบ
          } else {
            setUser(user)
            setLoading(false)
          }
        } else {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div className="text-center p-10">กำลังโหลดข้อมูล...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-300 p-4 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📿 แอปดวงหวย DuangHuay</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ดวง */}
          // ตัวอย่างปุ่มใน Home page
          <Link href="/fortune">
            <Card className="hover:shadow-lg transition">
              <CardContent className="text-center p-6">
                <div className="text-2xl mb-2">🔮 เบิกญาณทำนายชะตา</div>
                <p className="text-sm text-gray-500">เลือกหรือสวดอธิษฐาน แล้วไปต่อ</p>
              </CardContent>
            </Card>
          </Link>

           {/* เลขเด็ด */}
          <Link
            href="/lucky"
            className="bg-white shadow-md p-6 rounded-xl hover:bg-pink-100 transition"
          >
            <h2 className="text-xl font-semibold">🎯 เลขเด็ด AI</h2>
            <p className="text-sm mt-2">คำนวณเลขจากข่าว และผลหวยย้อนหลัง</p>
          </Link>

          {/* VIP */}
          <Link
            href="/vip"
            className="bg-white shadow-md p-6 rounded-xl hover:bg-green-100 transition"
          >
            <h2 className="text-xl font-semibold">💎 สมัคร VIP</h2>
            <p className="text-sm mt-2">ปลดล็อกฟีเจอร์พิเศษทั้งหมด</p>
          </Link>

          {/* ประวัติย้อนหลัง */}
          <Link
            href="/history"
            className="bg-white shadow-md p-6 rounded-xl hover:bg-blue-100 transition"
          >
            <h2 className="text-xl font-semibold">📜 ดูประวัติย้อนหลัง</h2>
            <p className="text-sm mt-2">ดูดวงและเลขที่เคยได้</p>
          </Link>

          {/* โปรไฟล์ */}
          <Link
            href="/profile"
            className="bg-white shadow-md p-6 rounded-xl hover:bg-purple-100 transition"
          >
            <h2 className="text-xl font-semibold">👤 โปรไฟล์ของฉัน</h2>
            <p className="text-sm mt-2">แก้ไขข้อมูล และสถานะ VIP</p>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">ขอบคุณที่ใช้ DuangHuay 🎉</p>
      </div>
    </div>
  )
}
