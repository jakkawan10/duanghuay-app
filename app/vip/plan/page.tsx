'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PlanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">เลือกแผนดูดวงของคุณ</h1>

      <div className="grid gap-6 max-w-md w-full">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">💎 Premium</h2>
          <p className="text-sm text-gray-300 mb-4">ดูดวง + ถามตอบรายสัปดาห์ไม่จำกัดคำถาม</p>
          <p className="text-lg font-bold text-green-400 mb-4">฿399 / เดือน</p>
          <Button onClick={() => router.push('/checkout?plan=premium')} className="w-full">
            สมัคร Premium
          </Button>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-yellow-500">
          <h2 className="text-xl font-semibold mb-2">👑 VIP</h2>
          <p className="text-sm text-gray-300 mb-4">เข้าถึงทุกฟีเจอร์ + เลขเด็ดล่วงหน้า</p>
          <p className="text-lg font-bold text-yellow-300 mb-4">฿999 / เดือน</p>
          <Button onClick={() => router.push('/checkout?plan=vip')} className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
            สมัคร VIP
          </Button>
        </div>
      </div>
    </div>
  )
}
