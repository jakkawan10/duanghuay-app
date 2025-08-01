'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function PremiumFortunePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (role !== 'premium' && role !== 'vip') {
      router.replace('/vip/plan')
    }
  }, [user, loading, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-200 to-blue-100 p-6 text-gray-800">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-yellow-500" /> เบิกญาณทำนายชะตา (Premium)
        </h1>
        <Card>
          <CardContent className="space-y-2 pt-6">
            <p>
              คุณสามารถใช้ระบบพูดคุยถามตอบกับหมอดูได้ไม่เกิน <strong>5 ข้อความต่อวัน</strong> ในหัวข้อต่าง ๆ เช่น การเงิน ความรัก อนาคต ฯลฯ
            </p>
            <p>
              ระบบนี้จำลองหมอดูจากเบื้องบนด้วยเทคโนโลยีพิเศษเพื่อช่วยแนะแนวทางชีวิต
            </p>
            <p className="text-sm text-gray-500">
              *หากต้องการใช้งานแบบไม่จำกัด กรุณาอัปเกรดเป็น VIP
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
