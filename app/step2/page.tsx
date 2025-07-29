'use client';

import { useState, useEffect } from 'react';

export default function Step2Page() {
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showFlameRight, setShowFlameRight] = useState(false);
  const [showIncense, setShowIncense] = useState(false);
  const [canShowPrayButton, setCanShowPrayButton] = useState(false);
  const [showPrayText, setShowPrayText] = useState(false);

  useEffect(() => {
    if (showFlameLeft && showFlameRight && showIncense) {
      setShowPrayText(true);
      const timer = setTimeout(() => {
        setCanShowPrayButton(true);
        setShowPrayText(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showFlameLeft, showFlameRight, showIncense]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#2a1e14]">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* 🎥 พื้นหลังวิดีโอ */}
        <video
          src="/videostep2.mp4"
          autoPlay
          loop
          muted={false}
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 🪔 กดธูป */}
        <div
          onClick={() => setShowIncense(true)}
          className="absolute top-[44%] left-1/2 w-[70px] h-[70px] -translate-x-1/2 cursor-pointer"
        />

        {/* 🔥 กดเทียนซ้าย */}
        <div
          onClick={() => setShowFlameLeft(true)}
          className="absolute top-[63%] left-[23%] w-[45px] h-[80px] cursor-pointer"
        />

        {/* 🔥 กดเทียนขวา */}
        <div
          onClick={() => setShowFlameRight(true)}
          className="absolute top-[63%] right-[23%] w-[45px] h-[80px] cursor-pointer"
        />

        {/* ✅ เอฟเฟกต์ธูป */}
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

        {/* ✨ ข้อความแนะนำเริ่มต้น */}
        {!canShowPrayButton && !showPrayText && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-sm animate-pulse bg-black/40 px-4 py-1 rounded-full">
            คลิกจุดเทียน จุดธูป เพื่อเริ่มพิธี
          </div>
        )}

        {/* 🧘‍♀️ ข้อความให้อธิษฐาน */}
        {showPrayText && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-yellow-300 text-base font-semibold animate-pulse bg-black/50 px-6 py-2 rounded-xl">
            ตั้งจิตอธิษฐาน...
          </div>
        )}

        {/* 🙏 ปุ่มอธิษฐานเสร็จแล้ว */}
        {canShowPrayButton && (
          <button
            onClick={() => window.location.href = '/step3'}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold py-2 px-6 rounded-full shadow-xl hover:bg-yellow-400"
          >
            อธิษฐานเสร็จแล้ว
          </button>
        )}
      </div>
    </div>
  );
}
