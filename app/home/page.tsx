'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [stepDone, setStepDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          if (data.step1Done && data.step2Done && data.step3Done) {
            setStepDone(true)
          } else {
            router.push('/step1')
          }
        } else {
          router.push('/step1')
        }
      } else {
        router.push('/auth')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-3xl animate-bounce">🔥</span>
      </div>
    )
  }

  if (!stepDone) return null

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">🎉 ยินดีต้อนรับ VIP!</h1>
      <p className="text-green-600 text-lg mb-8">ตอนนี้คุณสามารถเข้าถึงฟีเจอร์วิเคราะห์เลขเด็ดได้แล้ว!</p>

      <Image src="/fire-ritual.gif" alt="ritual" width={120} height={120} className="mx-auto mb-5" />

      <div className="flex flex-col gap-4">
        <a href="/vip" className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-6 rounded-xl">
          🔮 เข้าสู่หน้าวิเคราะห์เลขเด็ด
        </a>
        <a href="/notification" className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded-xl">
          🔔 ตั้งค่าการแจ้งเตือนหวย
        </a>
      </div>
    </div>
  )
}
