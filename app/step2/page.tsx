'use client';

import { useState } from 'react';

export default function Step2Page() {
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showIncense, setShowIncense] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* 🖼️ พื้นหลังพระ */}
        <img
          src="/step2-bg.jpg"
          className="w-full h-full object-cover"
          alt=""
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
            alt="flame"
          />
        )}
      </div>
    </div>
  );
}
