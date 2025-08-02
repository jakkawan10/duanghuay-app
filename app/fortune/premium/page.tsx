'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function PremiumFortunePage() {
  const router = useRouter()
  const { user, loading, userData } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (userData?.vipPlan !== 'premium') {
        router.replace('/vip/plan')
      }
    }
  }, [user, loading, userData, router])

  if (loading || !user || userData?.vipPlan !== 'premium') {
    return <p className="text-center mt-10">กำลังโหลด...</p>
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">🔮 เบิกญาณทำนายชะตา - ระดับ Premium</h1>
      <p className="text-center mb-6">คุณสามารถเข้าถึงดวงชะตารายสัปดาห์ในระดับ Premium ได้ที่นี่</p>

      {/* ตัวอย่างข้อมูลดวง */}
      <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">สัปดาห์นี้:</h2>
        <p className="mt-2">การงาน: มีโอกาสใหม่เข้ามา แต่ต้องกล้าเสี่ยง</p>
        <p>ความรัก: คนโสดมีเกณฑ์ได้พบคนใหม่</p>
        <p>การเงิน: มีรายรับพิเศษ แต่ระวังการใช้จ่ายเกินตัว</p>
      </div>
    </main>
  )
}
