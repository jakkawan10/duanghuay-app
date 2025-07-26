import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 mystical-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="temple-shadow bg-white/95 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                เข้าร่วมกับผู้คนหลายพันคนที่เลือกใช้ ดวงหวย เพื่อเพิ่มโอกาสถูกรางวัล
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-lg px-8 py-4 shadow-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  สมัครฟรีวันนี้
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              <p>✨ ไม่มีค่าใช้จ่ายในการสมัคร | 🔒 ข้อมูลปลอดภัย 100% | 📱 ใช้งานได้ทุกอุปกรณ์</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
