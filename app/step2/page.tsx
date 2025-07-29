'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Step2Page() {
  const router = useRouter();
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showFlameRight, setShowFlameRight] = useState(false);
  const [showIncense, setShowIncense] = useState(false);

  const isReady = showFlameLeft && showFlameRight && showIncense;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* 🎥 พื้นหลังวิดีโอ (พร้อมเสียง) */}
        <video
          src="/videostep2.mp4"
          autoPlay
          loop
          muted={false}
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 🪔 โซนกดธูป */}
        <div
          onClick={() => setShowIncense(true)}
          className="absolute top-[44%] left-1/2 w-[70px] h-[70px] -translate-x-1/2 cursor-pointer"
        />

        {/* 🔥 โซนกดเทียนซ้าย */}
        <div
          onClick={() => setShowFlameLeft(true)}
          className="absolute top-[63%] left-[23%] w-[45px] h-[80px] cursor-pointer"
        />

        {/* 🔥 โซนกดเทียนขวา */}
        <div
          onClick={() => setShowFlameRight(true)}
          className="absolute top-[63%] right-[23%] w-[45px] h-[80px] cursor-pointer"
        />

        {/* ✅ เอฟเฟกต์ควันธูป */}
        {showIncense && (
          <img
            src="/effects/incense.gif"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            alt="incense"
          />
        )}

        {/* ✅ เอฟเฟกต์เทียนซ้าย */}
        {showFlameLeft && (
          <img
            src="/effects/flame.gif"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            alt="flame-left"
          />
        )}

        {/* ✅ เอฟเฟกต์เทียนขวา */}
        {showFlameRight && (
          <img
            src="/effects/flame-right.gif"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            alt="flame-right"
          />
        )}

        {/* 🎯 ปุ่มไป Step 3 (แสดงเมื่อครบ 3 จุด) */}
        {isReady && (
          <button
            onClick={() => router.push('/step3')}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full text-lg font-bold shadow-lg animate-pulse"
          >
            อธิษฐานเสร็จแล้ว
          </button>
        )}
      </div>
    </div>
  );
}
