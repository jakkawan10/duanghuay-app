'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function VIPFortunePage() {
  const router = useRouter()
  const { user, loading, userData } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (userData?.vipPlan !== 'vip') {
        router.replace('/vip/plan')
      }
    }
  }, [user, loading, userData, router])

  if (loading || !user || userData?.vipPlan !== 'vip') {
    return <p className="text-center mt-10">กำลังโหลด...</p>
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">👑 เบิกญาณทำนายชะตา - ระดับ VIP</h1>
      <p className="text-center mb-6">คุณสามารถเข้าถึงคำทำนายพิเศษเฉพาะ VIP ได้ที่นี่</p>

      {/* ตัวอย่างข้อมูลดวงสำหรับ VIP */}
      <div className="bg-purple-100 border border-purple-300 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">คำทำนายพิเศษ:</h2>
        <p className="mt-2">คุณกำลังอยู่ในช่วงหัวเลี้ยวหัวต่อครั้งใหญ่ จงใช้ญาณของคุณตัดสินใจ</p>
        <p>สีมงคลของคุณ: สีม่วง</p>
        <p>เลขนำโชค: 8, 2, 19</p>
      </div>
    </main>
  )
}
