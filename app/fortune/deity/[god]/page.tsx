"use client";

import Image from "next/image";

export default function DeityPage({ params }: { params: { god: string } }) {
  const { god } = params;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      {/* ภาพเทพ */}
      <Image
        src={`/images/${god}.png`}
        alt={god}
        width={400}
        height={400}
        className="mb-6 rounded-lg"
      />

      {/* ช่องกรอกเลข */}
      <div className="w-full max-w-md space-y-6 text-white">
        {/* วิ่งโดดตัวเดียว */}
        <div>
          <label className="block mb-1">วิ่งโดดตัวเดียว</label>
          <input type="text" className="w-full border p-2 rounded bg-white text-black" />
        </div>

        {/* ยิ่งเดี่ยวรอง */}
        <div>
          <label className="block mb-1">ยิ่งเดี่ยวรอง</label>
          <input type="text" className="w-full border p-2 rounded bg-white text-black" />
        </div>

        {/* 2 ตัวเป้า */}
        <div>
          <label className="block mb-1">2 ตัวเป้า</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
          </div>
        </div>

        {/* 3 ตัววิน */}
        <div>
          <label className="block mb-1">3 ตัววิน</label>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
          </div>
        </div>

        {/* 4 ตัวรับทรัพย์ */}
        <div>
          <label className="block mb-1">4 ตัวรับทรัพย์</label>
          <div className="grid grid-cols-4 gap-2">
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
          </div>
        </div>

        {/* 5 ตัวรวยไว */}
        <div>
          <label className="block mb-1">5 ตัวรวยไว</label>
          <div className="grid grid-cols-5 gap-2">
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
            <input type="text" className="border p-2 rounded bg-white text-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
