'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Step1Page() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const playAudio = () => {
        audio.volume = 0.5
        audio.loop = true
        audio.muted = false
        const promise = audio.play()
        if (promise !== undefined) {
          promise.catch((err) => {
            console.log('Autoplay blocked:', err)
          })
        }
        document.removeEventListener('click', playAudio)
      }

      // เล่นทันที
      playAudio()

      // ถ้า autoplay โดนบล็อก ให้เล่นเมื่อผู้ใช้คลิก
      document.addEventListener('click', playAudio)
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 to-red-900 flex items-center justify-center">
      {/* พื้นหลัง */}
      <img
        src="/step1-bg.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />

      {/* เอฟเฟกต์ควัน (ใหญ่เท่าบริเวณวงกลมแดงที่วงไว้) */}
      <img
        src="/effects/smoke-center.gif"
        alt="smoke"
        className="absolute z-10 w-[400px] top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* ปุ่ม */}
      <button
        onClick={() => router.push('/step2')}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-yellow-400 text-black font-bold text-xl rounded-xl shadow-md hover:bg-yellow-500 z-20"
      >
        เริ่มการอธิษฐาน
      </button>

      {/* เสียง */}
      <audio ref={audioRef} src="/sounds/sound-temple.mp3" preload="auto" />
    </div>
  )
}
