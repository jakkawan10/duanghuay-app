'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan')
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user || !plan) return

    setLoading(true)
    const uid = user.uid
    const price = plan === 'vip' ? 999 : 399
    const days = plan === 'vip' ? 30 : 30
    const role = plan

    const expireAt = new Date()
    expireAt.setDate(expireAt.getDate() + days)

    await setDoc(doc(db, 'users', uid), {
      role,
      subscribedAt: serverTimestamp(),
      expireAt: expireAt.toISOString(),
    }, { merge: true })

    setLoading(false)
    router.push('/home')
  }

  const title = plan === 'vip' ? '👑 VIP' : '💎 Premium'
  const price = plan === 'vip' ? '฿999 / เดือน' : '฿399 / เดือน'

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>กรุณาเลือกแผนก่อน</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">ยืนยันการสมัคร {title}</h1>
        <p className="text-lg mb-4">{price}</p>

        <Button onClick={handleSubscribe} className="w-full" disabled={loading}>
          {loading ? 'กำลังดำเนินการ...' : `ยืนยันสมัคร ${title}`}
        </Button>
      </div>
    </div>
  )
}
