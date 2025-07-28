'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Step1Page() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.4
      audio.play().catch(() => {})
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ใช้ <img> เต็มจอแนวตั้ง */}
      <img
        src="/step1-bg.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />

      {/* เอฟเฟกต์หมุนกลางจอ */}
      <img
        src="/effects/smoke-center.gif"
        alt="smoke"
        className="absolute z-10 left-1/2 top-1/2 w-[120px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* ปุ่ม */}
      <button
        onClick={() => router.push('/step2')}
        className="absolute z-20 bottom-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition"
      >
        เริ่มการอธิษฐาน
      </button>

      {/* เสียงประกอบ */}
      <audio ref={audioRef} src="/sound-temple.mp3" loop />
    </div>
  )
}
