"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Check, Sparkles, TrendingUp, Bell, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

const vipFeatures = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "เลขเด็ด AI พิเศษ",
    description: "รับเลขเด็ดจาก AI ที่มีความแม่นยำสูงกว่า",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "วิเคราะห์เชิงลึก",
    description: "รายงานการวิเคราะห์แนวโน้มและสถิติโดยละเอียด",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "แจ้งเตือนพิเศษ",
    description: "รับการแจ้งเตือนเลขเด็ดและข่าวสารก่อนใคร",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "การสนับสนุนพิเศษ",
    description: "ได้รับการสนับสนุนและคำปรึกษาแบบพิเศษ",
  },
]

const vipPlans = [
  {
    id: "monthly",
    name: "รายเดือน",
    price: 299,
    duration: "30 วัน",
    popular: false,
  },
  {
    id: "quarterly",
    name: "รายไตรมาส",
    price: 799,
    duration: "90 วัน",
    popular: true,
    discount: "11% ประหยัด",
  },
  {
    id: "yearly",
    name: "รายปี",
    price: 2999,
    duration: "365 วัน",
    popular: false,
    discount: "17% ประหยัด",
  },
]

export default function VIPPage() {
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgradeVIP = async (planId: string) => {
    if (!user) return

    setLoading(true)
    try {
      // TODO: Integrate with payment system (Stripe, Omise, etc.)
      // For now, we'll simulate the upgrade

      await updateDoc(doc(db, "users", user.uid), {
        isVIP: true,
        vipPlan: planId,
        vipStartDate: new Date(),
        vipEndDate: new Date(
          Date.now() + (planId === "yearly" ? 365 : planId === "quarterly" ? 90 : 30) * 24 * 60 * 60 * 1000,
        ),
      })

      toast({
        title: "อัพเกรด VIP สำเร็จ!",
        description: "ยินดีต้อนรับสู่สมาชิก VIP",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเกรด VIP ได้ในขณะนี้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen mystical-bg p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <Crown className="w-10 h-10 inline-block mr-3 text-yellow-400" />
              สมาชิก VIP
            </h1>
            <p className="text-white/80 text-lg">ปลดล็อคคุณสมบัติพิเศษและรับเลขเด็ดที่แม่นยำยิ่งขึ้น</p>
          </div>

          {userData?.isVIP && (
            <Card className="temple-shadow mb-8 border-yellow-200">
              <CardHeader className="text-center">
                <CardTitle className="text-yellow-600 flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-2" />
                  คุณเป็นสมาชิก VIP แล้ว!
                </CardTitle>
                <CardDescription>ขอบคุณที่เป็นสมาชิก VIP ของเรา</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* VIP Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {vipFeatures.map((feature, index) => (
              <Card key={index} className="temple-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-yellow-600">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Plans */}
          {!userData?.isVIP && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vipPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`temple-shadow relative ${plan.popular ? "border-yellow-400 border-2" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gold-gradient">แนะนำ</Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-yellow-600">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-800">฿{plan.price.toLocaleString()}</div>
                    <CardDescription>{plan.duration}</CardDescription>
                    {plan.discount && (
                      <Badge variant="secondary" className="mt-2">
                        {plan.discount}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {vipFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature.title}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full gold-gradient"
                      onClick={() => handleUpgradeVIP(plan.id)}
                      disabled={loading}
                    >
                      {loading ? "กำลังดำเนินการ..." : "เลือกแพ็คเกจนี้"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Payment Note */}
          <Card className="temple-shadow mt-8">
            <CardContent className="text-center py-6">
              <p className="text-gray-600 mb-2">💳 รองรับการชำระเงินผ่าน: บัตรเครดิต, บัตรเดบิต, โมบายแบงก์กิ้ง</p>
              <p className="text-sm text-gray-500">ระบบการชำระเงินปลอดภัย 100% | ยกเลิกได้ทุกเมื่อ</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
