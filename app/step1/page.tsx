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
    <div className="relative w-full h-screen overflow-hidden">
      {/* พื้นหลัง */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/step1-bg.jpg')" }}
      />

      {/* เอฟเฟกต์ควันหมุนตรงกลาง */}
      <img
        src="/effects/smoke-center.gif"
        alt="smoke"
        className="absolute z-10 left-1/2 top-1/2 w-[120px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* ปุ่มเริ่ม */}
      <button
        onClick={() => router.push('/step2')}
        className="absolute z-20 bottom-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition"
      >
        เริ่มการอธิษฐาน
      </button>

      {/* เสียงประกอบ */}
      <audio ref={audioRef} src="/sound-temple.mp3" loop />
    </div>
  )
}
