'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Step2Page() {
  const [incenseVisible, setIncenseVisible] = useState(false)
  const [flameLeftVisible, setFlameLeftVisible] = useState(false)
  const [flameRightVisible, setFlameRightVisible] = useState(false)
  const router = useRouter()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* วิดีโอพื้นหลัง */}
      <video
        src="/videostep2.mp4"
        autoPlay
        loop
        muted={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ข้อความกระพริบ */}
      <div className="absolute bottom-[22%] w-full text-center z-30">
        <p className="text-yellow-200 text-xl animate-pulse drop-shadow-md">
          คลิกจุดเทียน จุดธูป เพื่อเริ่มพิธี
        </p>
      </div>

      {/* ธูป */}
      {incenseVisible && (
        <video
          src="/incense.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[80px] z-10"
        />
      )}
      <div
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[100px] h-[100px] z-20"
        onClick={() => setIncenseVisible(true)}
      />

      {/* เทียนซ้าย */}
      {flameLeftVisible && (
        <Image
          src="/flame.gif"
          alt="flame-left"
          width={60}
          height={150}
          className="absolute bottom-[15%] left-[20%] z-10"
        />
      )}
      <div
        className="absolute bottom-[15%] left-[20%] w-[60px] h-[150px] z-20"
        onClick={() => setFlameLeftVisible(true)}
      />

      {/* เทียนขวา */}
      {flameRightVisible && (
        <Image
          src="/flame-right.gif"
          alt="flame-right"
          width={60}
          height={150}
          className="absolute bottom-[15%] right-[20%] z-10"
        />
      )}
      <div
        className="absolute bottom-[15%] right-[20%] w-[60px] h-[150px] z-20"
        onClick={() => setFlameRightVisible(true)}
      />

      {/* ปุ่มไปต่อ */}
      <button
        onClick={() => router.push('/step3')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-full z-30 shadow-md hover:bg-yellow-300 transition"
      >
        อธิษฐานเสร็จแล้ว
      </button>
    </div>
  )
}
