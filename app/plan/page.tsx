'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlanPage() {
  const router = useRouter()

  const handleSelect = (plan: 'premium' | 'vip') => {
    router.push(`/checkout?plan=${plan}`)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">เลือกแผนการใช้งาน</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 💎 Premium Plan */}
        <Card>
          <CardHeader>
            <CardTitle>💎 Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 space-y-1 text-sm text-muted-foreground">
              <li>ดูดวงแม่นระดับกลาง</li>
              <li>เจาะลึกโชคลาภรายสัปดาห์</li>
              <li>ไม่แสดงโฆษณา</li>
            </ul>
            <div className="text-xl font-semibold mt-4 mb-2 text-primary">399 บาท / เดือน</div>
            <Button className="w-full" onClick={() => handleSelect('premium')}>
              สมัคร Premium
            </Button>
          </CardContent>
        </Card>

        {/* 👑 VIP Plan */}
        <Card>
          <CardHeader>
            <CardTitle>👑 VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 space-y-1 text-sm text-muted-foreground">
              <li>เข้าถึงดวงลับเฉพาะ</li>
              <li>วิเคราะห์เลขเด็ด AI ขั้นสูง</li>
              <li>สิทธิพิเศษสำหรับสมาชิก VIP เท่านั้น</li>
            </ul>
            <div className="text-xl font-semibold mt-4 mb-2 text-primary">999 บาท / เดือน</div>
            <Button className="w-full" onClick={() => handleSelect('vip')}>
              สมัคร VIP
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
