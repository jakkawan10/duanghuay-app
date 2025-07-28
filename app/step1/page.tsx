// app/step1/page.tsx
"use client";

import { useEffect } from "react";

export default function Step1Page() {
  useEffect(() => {
    const audio = new Audio("/sound-temple.mp3");
    audio.loop = true;
    audio.play().catch((e) => {
      console.log("Autoplay error:", e);
    });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* พื้นหลัง */}
      <img
        src="/step1-bg.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* เอฟเฟคควันหมุน */}
      <img
        src="/smoke-center.gif"
        alt="smoke"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-12 scale-150 pointer-events-none"
      />
    </div>
  );
}
