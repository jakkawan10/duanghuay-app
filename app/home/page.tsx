'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        router.push('/login')
        return
      }

      const uid = user.uid
      const userRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        // ถ้ายังทำพิธีไม่ครบ กลับไป step1
        if (!data.ritualStatus?.step3) {
          router.push('/step1')
          return
        }

        setUserData(data)
        setLoading(false)
      } else {
        router.push('/login')
      }
    }

    checkAuthAndFetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        กำลังโหลดข้อมูล...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6 p-4">
      <h1 className="text-3xl font-bold text-yellow-400">ยินดีต้อนรับ {userData.name || 'ผู้ใช้'} 🎉</h1>
      <p>คุณพร้อมเข้าสู่ระบบดูดวงหวยแล้ว!</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => router.push('/vip')}
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
        >
          เข้าสู่ระบบ VIP
        </button>
        <button
          onClick={() => router.push('/ai')}
          className="bg-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-400 transition"
        >
          วิเคราะห์เลข AI
        </button>
        <button
          onClick={() => router.push('/notifications')}
          className="bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition"
        >
          แจ้งเตือนดวงหวย
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="bg-gray-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-600 transition"
        >
          โปรไฟล์ของฉัน
        </button>
      </div>
    </div>
  )
}
