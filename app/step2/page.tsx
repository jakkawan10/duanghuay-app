"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Step2Page() {
  const router = useRouter();
  const [leftFlame, setLeftFlame] = useState(false);
  const [rightFlame, setRightFlame] = useState(false);
  const [incense, setIncense] = useState(false);

  const handleNext = () => {
    router.push("/step3");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* พื้นหลังวิดีโอ + เสียง */}
      <video
        src="/videos/step2.mp4"
        autoPlay
        loop
        muted={false}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* จุดเทียนซ้าย */}
      <div
        className="absolute bottom-24 left-6 z-10 cursor-pointer"
        onClick={() => setLeftFlame(true)}
      >
        {leftFlame && (
          <Image
            src="/effects/flame.gif"
            alt="flame-left"
            width={60}
            height={80}
          />
        )}
      </div>

      {/* จุดเทียนขวา */}
      <div
        className="absolute bottom-24 right-6 z-10 cursor-pointer"
        onClick={() => setRightFlame(true)}
      >
        {rightFlame && (
          <Image
            src="/effects/flame-right.gif"
            alt="flame-right"
            width={60}
            height={80}
          />
        )}
      </div>

      {/* จุดธูปตรงกลาง */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => setIncense(true)}
      >
        {incense && (
          <Image
            src="/effects/incense.gif"
            alt="incense"
            width={80}
            height={80}
          />
        )}
      </div>

      {/* ควันกลางจอ */}
      {leftFlame && rightFlame && incense && (
        <Image
          src="/effects/smoke-center.gif"
          alt="smoke"
          width={150}
          height={150}
          className="absolute top-10 left-1/2 -translate-x-1/2 z-20"
        />
      )}

      {/* ปุ่มไปหน้า Step 3 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={handleNext}
          className="bg-yellow-400 text-black px-6 py-2 rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          อธิษฐานเสร็จแล้ว
        </button>
      </div>
    </div>
  );
}
