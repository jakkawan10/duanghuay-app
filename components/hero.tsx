"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Crown, TrendingUp, Users } from "lucide-react"

export default function Hero() {
  const [currentNumber, setCurrentNumber] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 99))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen mystical-bg overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">ดวงหวย</h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow">
                <span className="text-white text-xl font-bold">{String(currentNumber).padStart(2, "0")}</span>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xl font-bold">
                  {String(Math.floor(Math.random() * 99)).padStart(2, "0")}
                </span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              ระบบทำนายและวิเคราะห์เลขเด็ดหวยด้วยเทคโนโลยี AI ที่ทันสมัย
              <br />
              <span className="text-yellow-300">เพิ่มโอกาสถูกรางวัลของคุณวันนี้</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="gold-gradient text-lg px-8 py-4 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                เริ่มต้นฟรี
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 temple-shadow">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-white/80">สมาชิกที่ไว้วางใจ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 temple-shadow">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <div className="text-white/80">ความแม่นยำ AI</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 temple-shadow">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">บริการตลอดเวลา</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 animate-float">
        <div className="w-12 h-12 bg-yellow-400/30 rounded-full blur-sm"></div>
      </div>
      <div className="absolute top-1/3 right-10 animate-float-delayed">
        <div className="w-8 h-8 bg-purple-400/30 rounded-full blur-sm"></div>
      </div>
    </div>
  )
}
