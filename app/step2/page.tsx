// app/step2/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Step2Page() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.2
      audio.play().catch((e) => {
        console.log('Audio play blocked:', e)
      })
    }
  }, [])

  const handleNext = () => {
    router.push('/step3')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <img
        src="/step2-bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Center smoke */}
      <video
        src="/smoke-center.mp4"
        className="absolute w-40 h-40 top-1/4 left-1/2 transform -translate-x-1/2"
        autoPlay
        loop
        muted
      />

      {/* Incense */}
      <video
        src="/incense.mp4"
        className="absolute w-20 h-32 bottom-1/3 left-1/2 transform -translate-x-1/2"
        autoPlay
        loop
        muted
      />

      {/* Flame left */}
      <video
        src="/flame.mp4"
        className="absolute w-20 h-20 bottom-20 left-10"
        autoPlay
        loop
        muted
      />

      {/* Flame right */}
      <video
        src="/flame.mp4"
        className="absolute w-20 h-20 bottom-20 right-10"
        autoPlay
        loop
        muted
      />

      {/* Button */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <button
          onClick={handleNext}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-xl text-xl font-bold shadow-lg"
        >
          อธิษฐานเสร็จแล้ว
        </button>
      </div>

      {/* Sound */}
      <audio ref={audioRef} src="/sound-temple.mp3" />
    </div>
  )
}

