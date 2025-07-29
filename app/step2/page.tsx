"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Step2Page() {
  const router = useRouter();
  const [leftFlame, setLeftFlame] = useState(false);
  const [rightFlame, setRightFlame] = useState(false);
  const [incense, setIncense] = useState(false);

  const handleNext = () => {
    router.push("/step3");
  };

  const allComplete = leftFlame && rightFlame && incense;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* วิดีโอพื้นหลังพร้อมเสียง */}
      <video
        src="/videostep2.mp4"
        autoPlay
        loop
        muted={false}
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* จุดคลิกเทียนซ้าย */}
      <div
        className="absolute bottom-[15%] left-[20%] w-[60px] h-[150px] z-20 cursor-pointer"
        onClick={() => setLeftFlame(true)}
      />

      {/* จุดคลิกเทียนขวา */}
      <div
        className="absolute bottom-[15%] right-[20%] w-[60px] h-[150px] z-20 cursor-pointer"
        onClick={() => setRightFlame(true)}
      />

      {/* จุดคลิกธูปกลาง */}
      <div
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[100px] h-[100px] z-20 cursor-pointer"
        onClick={() => setIncense(true)}
      />

      {/* แสดงควันเมื่อครบทุกจุด */}
      {allComplete && (
        <Image
          src="/effects/smoke-center.gif"
          alt="smoke"
          width={150}
          height={150}
          className="absolute top-10 left-1/2 -translate-x-1/2 z-30"
        />
      )}

      {/* ปุ่มไป Step 3 */}
      {allComplete && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <Button
            onClick={handleNext}
            className="bg-yellow-400 text-black px-6 py-2 rounded-xl shadow-lg hover:bg-yellow-300 transition"
          >
            อธิษฐานเสร็จแล้ว
          </Button>
        </div>
      )}
    </div>
  );
}
