'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'


export default function FortunePage() {
  const [tier, setTier] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkTier = async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return router.push('/login')

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return

      const userTier = docSnap.data().tier || 'free'
      setTier(userTier)
    }

    checkTier()
  }, [])

  const handleSelect = (selectedTier: string) => {
    if (tier === 'vip' || tier === 'premium') {
      router.push(`/fortune/${selectedTier}`)
    } else if (selectedTier === 'free') {
      router.push('/fortune/free')
    } else {
      alert('เฉพาะสมาชิก Premium หรือ VIP เท่านั้น')
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold mb-4">🔮 เลือกรูปแบบการเบิกญาณ</h1>

      <button
        onClick={() => handleSelect('free')}
        className="bg-white text-black rounded p-4 w-80 shadow hover:bg-gray-100"
      >
        🆓 Free <br />
        <span className="text-sm">ทำนายจากวัน/เดือน/ปีเกิด แบบข้อความ</span>
      </button>

      <button
        onClick={() => handleSelect('premium')}
        className="bg-white text-black rounded p-4 w-80 shadow hover:bg-gray-100"
      >
        💎 Premium <br />
        <span className="text-sm">ถามตอบกับหมอ AI (จำกัดข้อความ)</span>
      </button>

      <button
        onClick={() => handleSelect('vip')}
        className="bg-white text-black rounded p-4 w-80 shadow hover:bg-gray-100"
      >
        👑 VIP <br />
        <span className="text-sm">ถามตอบได้ทุกเรื่องลึกแบบไม่จำกัด</span>
      </button>
    </main>
  )
}
