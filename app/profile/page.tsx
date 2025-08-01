'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ProfilePage() {
  const { user } = useAuth()
  const [role, setRole] = useState('free')
  const [expireAt, setExpireAt] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchRole = async () => {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setRole(data.role || 'free')
        setExpireAt(data.expireAt || null)
      }
    }

    fetchRole()
  }, [user])

  const getBadge = () => {
    if (role === 'vip') return '👑 VIP Member'
    if (role === 'premium') return '💎 Premium Member'
    return '🆓 Free Member'
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ของคุณ</h1>
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <p><strong>อีเมล:</strong> {user?.email}</p>
        <p><strong>สถานะ:</strong> {getBadge()}</p>
        {expireAt && (
          <p><strong>หมดอายุ:</strong> {new Date(expireAt).toLocaleDateString('th-TH')}</p>
        )}
      </div>
    </div>
  )
}
