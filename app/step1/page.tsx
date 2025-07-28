'use client';

import { useRouter } from 'next/navigation';

export default function Step1Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/step2');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Fullscreen Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videostep1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay Button */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <button
          onClick={handleClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-md transition"
        >
          เตรียมการอธิษฐาน
        </button>
      </div>
    </div>
  );
}
