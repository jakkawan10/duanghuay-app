'use client';

import { useState } from 'react';

export default function Step2Page() {
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showIncense, setShowIncense] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* 🖼️ พื้นหลังพิธี */}
        <img
          src="/step2-bg.jpg"
          className="w-full h-full object-cover"
          alt=""
        />

        {/* 🔥 คลิกเทียนซ้าย */}
        <div
          onClick={() => setShowFlameLeft(true)}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* 🪔 คลิกธูปกลาง */}
        <div
          onClick={() => setShowIncense(true)}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* 🔥 เอฟเฟกต์เปลวเทียนซ้าย */}
        {showFlameLeft && (
          <img
            src="/effects/flame.gif"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            alt=""
          />
        )}

        {/* 🪔 เอฟเฟกต์ควันธูป */}
        {showIncense && (
          <img
            src="/effects/incense.gif"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            alt=""
          />
        )}
      </div>
    </div>
  );
}
