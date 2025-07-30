'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase' // ✅ สำคัญ! ต้อง import

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('🟢 Login user:', user.uid)
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('🟢 User data:', userData)
            if (!userData.isVIP) {
              alert('คุณยังไม่ได้เป็น VIP')
            }
          } else {
            console.log('❌ No user document found')
            router.push('/login')
          }
        } catch (error) {
          console.error('🔥 Error reading userDoc:', error)
          router.push('/login')
        }
      } else {
        console.log('🔴 User not authenticated')
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-white">🔥 หน้านี้แสดงหลัง Login แล้ว</h1>
    </main>
  )
}
