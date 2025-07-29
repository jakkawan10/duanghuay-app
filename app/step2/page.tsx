'use client';

import { useState } from 'react';

export default function Step2Page() {
  const [showFlameLeft, setShowFlameLeft] = useState(false);
  const [showFlameRight, setShowFlameRight] = useState(false);
  const [showIncense, setShowIncense] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[450px] aspect-[3/4] rounded-xl overflow-hidden shadow-xl">

        {/* พื้นหลัง */}
        <img
          src="/step2-bg.jpg"
          className="w-full h-full object-cover"
          alt="พิธีกรรม"
        />

        {/* คลิกปลายเทียนซ้าย */}
        <div
          onClick={() => setShowFlameLeft(true)}
          className="absolute top-[18%] left-[10%] w-[50px] h-[50px] cursor-pointer"
        ></div>

        {/* คลิกปลายเทียนขวา */}
        <div
          onClick={() => setShowFlameRight(true)}
          className="absolute top-[18%] right-[10%] w-[50px] h-[50px] cursor-pointer"
        ></div>

        {/* คลิกกระถางธูปตรงกลาง */}
        <div
          onClick={() => setShowIncense(true)}
          className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[60px] h-[60px] cursor-pointer"
        ></div>

        {/* เอฟเฟกต์วิดีโอ: เทียนซ้าย */}
        {showFlameLeft && (
          <video
            src="/flame.mp4"
            autoPlay
            loop
            muted
            className="absolute top-[18%] left-[10%] w-[40px] h-auto"
          />
        )}

        {/* เอฟเฟกต์วิดีโอ: เทียนขวา */}
        {showFlameRight && (
          <video
            src="/flame.mp4"
            autoPlay
            loop
            muted
            className="absolute top-[18%] right-[10%] w-[40px] h-auto"
          />
        )}

        {/* เอฟเฟกต์วิดีโอ: ควันธูป */}
        {showIncense && (
          <video
            src="/incense.mp4"
            autoPlay
            loop
            muted
            className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[60px] h-auto"
          />
        )}
      </div>
    </div>
  );
}
