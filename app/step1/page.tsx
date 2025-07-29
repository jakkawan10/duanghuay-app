'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Step1Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // เล่นวิดีโอทันทีเมื่อโหลด (ถ้าอนุญาต)
  useEffect(() => {
    const tryPlay = () => {
      const video = videoRef.current;
      if (video) {
        video.play().catch((e) => {
          // ถ้า autoplay ถูกบล็อก — รอให้ user แตะจอ
          document.body.addEventListener('click', () => {
            video.play().catch(() => {});
          }, { once: true });
        });
      }
    };

    tryPlay();
  }, []);

  const handleClick = () => {
    router.push('/step2');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-[450px] w-full aspect-[3/4] relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-xl shadow-xl"
          src="/videostep1-v2.mp4"
          autoPlay
          loop
          playsInline
          controls={false}
        />
        <div className="absolute bottom-4 w-full flex justify-center">
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-bold py-3 px-10 rounded-xl shadow-lg text-xl hover:scale-105 transition"
          >
            เตรียมคำอธิษฐาน
          </button>
        </div>
      </div>
    </div>
  );
}

