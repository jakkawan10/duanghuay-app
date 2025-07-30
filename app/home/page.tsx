'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [isVIP, setIsVIP] = useState(false)
  const router = useRouter()

  useEffect(() => {
  const auth = getAuth()
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      console.log("userDoc.exists:", userDoc.exists()) // ✅ debug
      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log("user data:", data) // ✅ debug
        setIsVIP(data?.isVIP === true)
      } else {
        setIsVIP(false)
      }
    } catch (error) {
      console.error('Error fetching user document:', error)
      setIsVIP(false)
    } finally {
      setLoading(false)
    }
  })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>
  }

  if (!isVIP) {
    return (
      <div className="text-center mt-20 text-red-600 text-xl">
        คุณยังไม่ได้เป็น VIP <br />
        กรุณาอัปเกรดเพื่อเข้าถึงฟีเจอร์เต็มรูปแบบ
      </div>
    )
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 ยินดีต้อนรับ VIP!</h1>
      <p className="text-lg text-green-600">
        ตอนนี้คุณสามารถเข้าถึงฟีเจอร์วิเคราะห์เลขเด็ดได้แล้ว!
      </p>
    </div>
  )
}
