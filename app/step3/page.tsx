'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Step3Page() {
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
    router.push('/ai-lucky')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <img
        src="/step3-bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Smoke Center */}
      <video
        src="/smoke-center.mp4"
        className="absolute w-40 h-40 top-1/3 left-1/2 transform -translate-x-1/2"
        autoPlay
        loop
        muted
      />

      {/* Button */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <button
          onClick={handleNext}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg"
        >
          รับเลขเด็ดจาก AI
        </button>
      </div>

      {/* Sound */}
      <audio ref={audioRef} src="/sound-temple.mp3" />
    </div>
  )
}

