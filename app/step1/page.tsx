'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function Step1Page() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.4
      audio.play().catch(() => {}) // เผื่อ autoplay ถูกบล็อก
    }
  }, [])

  return (
    <div
  className="w-full h-screen bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/step1-bg.jpg')" }}
>
  {/* เนื้อหาภายใน */}



      {/* เอฟเฟกต์ควันหมุน */}
      <img
        src="/effects/smoke-center.gif"
        alt="smoke"
        className="absolute left-1/2 top-1/2 w-[120px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* ปุ่มเริ่มการอธิษฐาน */}
      <button
        onClick={() => router.push('/step2')}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition"
      >
        เริ่มการอธิษฐาน
      </button>

      {/* เสียง */}
      <audio ref={audioRef} src="/sound-temple.mp3" loop />
    </div>
  )
}
