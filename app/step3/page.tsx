// app/step3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Step3Page() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src="/step3-bg.jpg"
          alt="background"
          className="object-cover w-full h-full opacity-90"
        />
      </div>

      <div className="relative z-10 text-center p-6 animate-pulse">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
          ดวงดีรับทรัพย์ทุกงวด!
        </h1>
        <p className="text-xl mt-4 text-yellow-300 animate-bounce">
          ตัวเลขมันขึ้นอยู่กับดวงคุณ
        </p>
      </div>

      {showButton && (
        <button
          onClick={() => router.push("/home")}
          className="relative z-10 mt-10 bg-yellow-400 hover:bg-yellow-500 text-black text-xl font-bold py-3 px-6 rounded-full shadow-lg animate-fade-in"
        >
          🔮 เปิดดวงเลขเด็ด
        </button>
      )}

      <audio autoPlay loop>
        <source src="/sound-temple.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
