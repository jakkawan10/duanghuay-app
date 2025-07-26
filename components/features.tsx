import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Crown, Shield, TrendingUp, Bell } from "lucide-react"

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI วิเคราะห์เลขเด็ด",
    description: "ระบบ AI ที่วิเคราะห์ข้อมูลหลายมิติเพื่อให้เลขเด็ดที่แม่นยำ",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "ทำนายดวงส่วนตัว",
    description: "วิเคราะห์ดวงชะตาและแนะนำเลขที่เหมาะกับคุณเป็นพิเศษ",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "สถิติและแนวโน้ม",
    description: "วิเคราะห์สถิติผลหวยย้อนหลังและคาดการณ์แนวโน้ม",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    icon: <Crown className="w-8 h-8" />,
    title: "สมาชิก VIP",
    description: "รับเลขเด็ดพิเศษและคุณสมบัติเพิ่มเติมสำหรับสมาชิก VIP",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "แจ้งเตือนทันที",
    description: "รับการแจ้งเตือนเลขเด็ดใหม่และข่าวสารสำคัญ",
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "ปลอดภัย 100%",
    description: "ระบบรักษาความปลอดภัยข้อมูลระดับธนาคาร",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">ทำไมต้องเลือก ดวงหวย?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            เราใช้เทคโนโลยี AI และความรู้ด้านโหราศาสตร์เพื่อให้คุณได้รับเลขเด็ดที่แม่นยำที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="temple-shadow hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special VIP Section */}
        <div className="mt-16">
          <Card className="temple-shadow border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-12 h-12 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl text-yellow-700 mb-2">สมาชิก VIP พิเศษ</CardTitle>
              <CardDescription className="text-lg text-gray-700">ปลดล็อคคุณสมบัติพิเศษและรับเลขเด็ดที่แม่นยำยิ่งขึ้น</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>เลขเด็ด AI ความแม่นยำสูง</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>วิเคราะห์เชิงลึกจากข่าวสาร</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>การสนับสนุนแบบพิเศษ</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>แจ้งเตือนก่อนใครอื่น</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>รายงานสถิติโดยละเอียด</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="gold-gradient">VIP</Badge>
                    <span>ไม่มีโฆษณารบกวน</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
