// app/fortune/vip/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { checkVipAccess } from '@/lib/permissions'

export default function VIPFortunePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && role !== 'vip') {
      router.replace('/vip/plan')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="text-center mt-10 text-gray-500">กำลังโหลด...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">👑 เบิกญาณทำนายชะตา (VIP)</h1>
      <p className="text-center text-gray-600 mb-6">
        ถามได้ทุกเรื่องไม่จำกัด — ระบบจะตอบคำทำนายเฉพาะคุณเท่านั้น
      </p>

      <div className="border border-purple-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
        <p className="text-sm text-gray-700 mb-1">🧙‍♂️ หมอดู:</p>
        <div className="text-gray-800">สวัสดีครับ ท่านต้องการสอบถามเรื่องใดของโชคชะตา?</div>
      </div>

      {/* ส่วนใส่ข้อความ */}
      <input
        type="text"
        placeholder="พิมพ์คำถามของคุณ..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
      />
      <button className="mt-3 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
        ส่งคำถาม
      </button>
    </div>
  )
}
