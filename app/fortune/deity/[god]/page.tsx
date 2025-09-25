"use client";

import Image from "next/image";

export default function DeityPage({ params }: { params: { god: string } }) {
  const { god } = params;

  return (
    <div className="flex flex-col items-center p-4">
      {/* ภาพเทพ */}
      <Image
        src={`/images/${god}.png`}
        alt={god}
        width={400}
        height={400}
        className="mb-6 rounded-lg"
      />

      {/* ช่องกรอกเลขแบบเดียวกับ Admin */}
      <div className="w-full max-w-md space-y-6">
        {/* เลข 1 ตัว */}
        <div>
          <label className="block mb-1">เลข 1 ตัว</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>

        {/* เลข 2 ตัว */}
        <div>
          <label className="block mb-1">เลข 2 ตัว</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
          </div>
        </div>

        {/* เลข 3 ตัว */}
        <div>
          <label className="block mb-1">เลข 3 ตัว</label>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
          </div>
        </div>

        {/* เลข 4 ตัว */}
        <div>
          <label className="block mb-1">เลข 4 ตัว</label>
          <div className="grid grid-cols-4 gap-2">
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
          </div>
        </div>

        {/* เลข 5 ตัว */}
        <div>
          <label className="block mb-1">เลข 5 ตัว</label>
          <div className="grid grid-cols-5 gap-2">
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
            <input type="text" className="border p-2 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
