'use client';

import { useState, useEffect } from 'react';

export default function Step2Page() {
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showFlameRight, setShowFlameRight] = useState(false);
  const [showIncense, setShowIncense] = useState(false);
  const [showPrayText, setShowPrayText] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  const isAllLit = showFlameLeft && showFlameRight && showIncense;

  useEffect(() => {
    if (isAllLit) {
      setShowPrayText(true);
      const timer = setTimeout(() => {
        setShowDoneButton(true);
      }, 10000); // 10 วินาที

      return () => clearTimeout(timer);
    }
  }, [isAllLit]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1b0c07]">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* 🎥 วิดีโอพื้นหลัง + เสียง */}
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
          className="absolute top-[63%] left-[77%] w-[45px] h-[80px] cursor-pointer"
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

        {/* ✨ ข้อความกระพริบ */}
        {!isAllLit && (
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-white text-lg animate-pulse">
            คลิกจุดเทียน จุดธูป เพื่อเริ่มพิธี
          </div>
        )}

        {/* 🙏 ข้อความอธิษฐาน */}
        {showPrayText && !showDoneButton && (
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-yellow-300 text-xl animate-pulse">
            🙏 กรุณาอธิษฐาน
          </div>
        )}

        {/* ✅ ปุ่ม "อธิษฐานเสร็จแล้ว" */}
        {showDoneButton && (
          <button
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-xl shadow-xl transition"
            onClick={() => {
              window.location.href = '/step3';
            }}
          >
            อธิษฐานเสร็จแล้ว
          </button>
        )}
      </div>
    </div>
  );
}
