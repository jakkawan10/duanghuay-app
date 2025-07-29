'use client';

import { useState } from 'react';

export default function Step2Page() {
  const [flameLeft, setFlameLeft] = useState(false);
  const [flameRight, setFlameRight] = useState(false);
  const [incense, setIncense] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* ภาพพื้นหลังพระพุทธรูป */}
        <img
          src="/step2-bg.jpg"
          className="w-full h-full object-cover"
          alt="พิธีกรรม"
        />

        {/* ✅ พื้นที่คลิก: เทียนซ้าย */}
        <div
          onClick={() => setFlameLeft(true)}
          className="absolute top-[57.5%] left-[12%] w-[60px] h-[100px] cursor-pointer"
        />

        {/* ✅ พื้นที่คลิก: เทียนขวา */}
        <div
          onClick={() => setFlameRight(true)}
          className="absolute top-[57.5%] right-[12%] w-[60px] h-[100px] cursor-pointer"
        />

        {/* ✅ พื้นที่คลิก: กระถางธูปกลาง */}
        <div
          onClick={() => setIncense(true)}
          className="absolute top-[52%] left-1/2 transform -translate-x-1/2 w-[100px] h-[100px] cursor-pointer"
        />

        {/* 🔥 เอฟเฟกต์: เทียนซ้าย */}
        {flameLeft && (
          <img
            src="/effects/flame.gif"
            className="absolute top-[57.5%] left-[12%] w-[60px] h-[100px] pointer-events-none"
          />
        )}

        {/* 🔥 เอฟเฟกต์: เทียนขวา */}
        {flameRight && (
          <img
            src="/effects/flame.gif"
            className="absolute top-[57.5%] right-[12%] w-[60px] h-[100px] pointer-events-none"
          />
        )}

        {/* 🪔 เอฟเฟกต์: ควันธูป */}
        {incense && (
          <img
            src="/effects/incense.gif"
            className="absolute top-[52%] left-1/2 transform -translate-x-1/2 w-[100px] h-[100px] pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
