"use client";

import Image from "next/image";

const deityNames: Record<string, { name: string; desc: string }> = {
  sroiboon: {
    name: "เจ้าแม่สร้อยบุญ",
    desc: "ผู้ประทานโชคลาภและความมั่งมีศรีสุข",
  },
  maneewitch: {
    name: "เจ้ามณีเวทยมนต์",
    desc: "ผู้ครอบครองมนต์ศักดิ์สิทธิ์และพลังแห่งปัญญา",
  },
  intra: {
    name: "เจ้าองค์อินทร์แสนดี",
    desc: "ผู้ปกป้องคุ้มครองให้พ้นภัยอันตรายทั้งปวง",
  },
  dandok: {
    name: "เจ้าแม่ดานดอกษ์ศ์",
    desc: "ผู้มอบพลังแห่งความอุดมสมบูรณ์และความสำเร็จ",
  },
};

export default function DeityPage({ params }: { params: { god: string } }) {
  const { god } = params;
  const deity = deityNames[god] || { name: god, desc: "" };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-center">
      {/* ชื่อเทพ */}
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">{deity.name}</h1>

      {/* ภาพเทพ */}
      <Image
        src={`/images/${god}.png`}
        alt={deity.name}
        width={400}
        height={400}
        className="mb-4 rounded-lg"
      />

      {/* คำบรรยาย */}
      <p className="text-gray-300 mb-8">{deity.desc}</p>

      {/* ช่องกรอกเลข */}
      <div className="w-full max-w-md space-y-6 text-yellow-400">
        {/* วิ่งโดดตัวเดียว */}
        <div>
          <label className="block mb-1">วิ่งโดดตัวเดียว</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-white text-black text-center"
          />
        </div>

        {/* ยิ่งเดี่ยวรอง */}
        <div>
          <label className="block mb-1">ยิ่งเดี่ยวรอง</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-white text-black text-center"
          />
        </div>

        {/* 2 ตัวเป้า */}
        <div>
          <label className="block mb-1">2 ตัวเป้า</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
          </div>
        </div>

        {/* 3 ตัววิน */}
        <div>
          <label className="block mb-1">3 ตัววิน</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
          </div>
        </div>

        {/* 4 ตัวรับทรัพย์ */}
        <div>
          <label className="block mb-1">4 ตัวรับทรัพย์</label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
          </div>
        </div>

        {/* 5 ตัวรวยไว */}
        <div>
          <label className="block mb-1">5 ตัวรวยไว</label>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
            <input
              type="text"
              className="border p-2 rounded bg-white text-black text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
