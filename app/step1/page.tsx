'use client'

import { useRouter } from 'next/navigation'

export default function Step1() {
  const router = useRouter()

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* วิดีโอเต็มจอ */}
      <video
        src="/videostep1.mp4"
        autoPlay
        loop
        playsInline
        controls={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ปุ่ม */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => router.push('/step2')}
          className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl text-xl shadow-lg hover:scale-105 transition"
        >
          เตรียมการอธิษฐาน
        </button>
      </div>
    </div>
  )
}
