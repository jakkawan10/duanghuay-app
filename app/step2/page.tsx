'use client';

import { useState } from 'react';

export default function Step2Page() {
  const [flameLeft, setFlameLeft] = useState(false);
  const [flameRight, setFlameRight] = useState(false);
  const [incense, setIncense] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] overflow-hidden rounded-xl shadow-xl">

        {/* พื้นหลัง */}
        <img
          src="/step2-bg.jpg"
          className="w-full h-full object-cover"
          alt="พิธีกรรม"
        />

        {/* 🔥 ปลายเทียนซ้าย */}
        <div
          className="absolute top-[58%] left-[16%] w-[40px] h-[40px] cursor-pointer"
          onClick={() => setFlameLeft(true)}
        ></div>

        {/* 🔥 ปลายเทียนขวา */}
        <div
          className="absolute top-[58%] right-[16%] w-[40px] h-[40px] cursor-pointer"
          onClick={() => setFlameRight(true)}
        ></div>

        {/* 🪔 ธูปตรงกลาง */}
        <div
          className="absolute top-[57%] left-1/2 transform -translate-x-1/2 w-[60px] h-[60px] cursor-pointer"
          onClick={() => setIncense(true)}
        ></div>

        {/* 🌟 เอฟเฟกต์ GIF แสดงเมื่อถูกแตะ */}
        {flameLeft && (
          <img
            src="/effects/flame.gif"
            className="absolute top-[58%] left-[16%] w-[40px] h-[40px] pointer-events-none"
          />
        )}
        {flameRight && (
          <img
            src="/effects/flame.gif"
            className="absolute top-[58%] right-[16%] w-[40px] h-[40px] pointer-events-none"
          />
        )}
        {incense && (
          <img
            src="/effects/incense.gif"
            className="absolute top-[57%] left-1/2 transform -translate-x-1/2 w-[60px] h-[60px] pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
