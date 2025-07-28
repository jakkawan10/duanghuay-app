'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.2
      audio.play().catch((e) => {
        console.log('Audio play blocked:', e)
      })
    }
  }, [])

  const handleFinish = () => {
    localStorage.setItem('prayed', 'true')
    router.replace('/home')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background image */}
      <img
        src="/step2-bg.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Center smoke */}
      <video
        src="/smoke-center.mp4"
        autoPlay
        loop
        muted
        className="absolute top-1/2 left-1/2 w-60 h-60 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      />

      {/* Incense smoke */}
      <video
        src="/incense.mp4"
        autoPlay
        loop
        muted
        className="absolute bottom-32 left-1/2 w-32 h-32 -translate-x-1/2 z-10 pointer-events-none"
      />

      {/* Candle flames (left and right) */}
      <video
        src="/flame.mp4"
        autoPlay
        loop
        muted
        className="absolute bottom-10 left-10 w-24 h-24 z-10 pointer-events-none"
      />
      <video
        src="/flame.mp4"
        autoPlay
        loop
        muted
        className="absolute bottom-10 right-10 w-24 h-24 z-10 pointer-events-none"
      />

      {/* Background sound */}
      <audio ref={audioRef} src="/sound-temple.mp3" loop />

      {/* Button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={handleFinish}
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-xl hover:bg-yellow-300 transition"
        >
          🎯 อธิษฐานเสร็จแล้ว
        </button>
      </div>
    </div>
  )
}

