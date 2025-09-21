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
            router.push('/login')
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">📿 DuangHuay – เปิดดวงรับโชค</h1>
        <p className="text-center text-sm text-gray-700 mb-6">
          ดูเลขเด็ดฟรีได้ 1 เทพ หากต้องการดูเทพอื่นๆ กรุณาสมัคร VIP
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/fortune/deity/sroiboon">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-pink-100 transition text-center">
              🙇‍♀️ เจ้าแม่สร้อยบุญ
            </button>
          </Link>
          <Link href="/fortune/deity/saifah">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-blue-100 transition text-center">
              ⚡ เจ้าแม่สายฟ้า
            </button>
          </Link>
          <Link href="/fortune/deity/intree">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-yellow-100 transition text-center">
              🧙‍♂️ เจ้าพ่ออินทรีย์แดง
            </button>
          </Link>
          <Link href="/fortune/deity/samdaeng">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-green-100 transition text-center">
              🤪 เจ้าพ่อสำแดงฤทธิ์
            </button>
          </Link>

          {/* ปุ่มเทพ AI */}
          <Link href="/fortune/ai">
            <button className="bg-gradient-to-r from-yellow-400 to-red-400 w-full p-6 rounded-xl shadow-lg text-white font-bold text-center text-xl hover:scale-105 transition">
              🤖 เทพ AI เลขเด็ดสุดล้ำ
            </button>
          </Link>

          {/* สมัคร VIP */}
          <Link href="/vip">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-purple-100 transition text-center">
              💎 สมัคร VIP
            </button>
          </Link>

          {/* โปรไฟล์ */}
          <Link href="/profile">
            <button className="bg-white w-full p-5 rounded-xl shadow hover:bg-gray-100 transition text-center">
              👤 โปรไฟล์ของฉัน
            </button>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">🙏 ขอบคุณที่ใช้ DuangHuay</p>
      </div>
    </div>
  )
}
