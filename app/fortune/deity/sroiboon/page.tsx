'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SroiBoonPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mt-6 mb-2 text-yellow-400">
        เจ้าแม่สร้อยบุญ ✨
      </h1>
      <p className="mb-6 text-center text-sm text-gray-300">
        ท่านคือเทพีแห่งโชคลาภ การค้าขาย ความสำเร็จ และการอธิษฐานสำเร็จไว
      </p>

      <Image
        src="/images/sroiboon.png" // ⭐ เปลี่ยนชื่อไฟล์ให้ตรงกับภาพจริง
        alt="เจ้าแม่สร้อยบุญ"
        width={280}
        height={280}
        className="rounded-xl mb-6 shadow-lg border border-yellow-500"
      />

      <button
        onClick={() => router.push('/fortune')}
        className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
      >
        🔮 กลับสู่หน้าทำนายดวง
      </button>
    </main>
  );
}
