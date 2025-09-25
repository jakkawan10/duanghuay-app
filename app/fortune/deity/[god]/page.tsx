"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type PredictionData = {
  oneDigit?: string;
  onePair?: string;
  twoDigit?: string;
  threeDigit?: string;
  fourDigit?: string;
  fiveDigit?: string;
};

export default function DeityPage() {
  const { god } = useParams<{ god: string }>();
  const [data, setData] = useState<PredictionData | null>(null);

  useEffect(() => {
    if (!god) return;
    const ref = doc(db, "predictions", god);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data() as PredictionData);
      }
    });

    return () => unsub();
  }, [god]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* ชื่อเทพ */}
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">
        เทพ {god}
      </h1>

      {/* ภาพเทพ */}
      <img
        src={`/images/${god}.png`}
        alt={god}
        className="mb-4 rounded-lg shadow-lg"
        width={300}
        height={400}
      />

      {/* คำบรรยาย */}
      <p className="mb-6 text-center text-gray-300">
        ผู้ประทานโชคลาภและความมั่งคั่งแก่ผู้ศรัทธา
      </p>

      {/* วิ่งโดดตัวเดียว */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">วิ่งโดดตัวเดียว</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.oneDigit || "-"}
        </div>
      </div>

      {/* ยิงเดี่ยวรอง */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">ยิงเดี่ยวรอง</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.onePair || "-"}
        </div>
      </div>

      {/* 2 ตัวเป้า */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">2 ตัวเป้า</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.twoDigit || "-"}
        </div>
      </div>

      {/* 3 ตัววิน */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">3 ตัววิน</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.threeDigit || "-"}
        </div>
      </div>

      {/* 4 ตัวรับทรัพย์ */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">4 ตัวรับทรัพย์</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.fourDigit || "-"}
        </div>
      </div>

      {/* 5 ตัวรวยไว */}
      <div className="mb-4 w-full max-w-md">
        <p className="font-semibold mb-1 text-yellow-400">5 ตัวรวยไว</p>
        <div className="bg-white text-black py-2 text-center rounded">
          {data?.fiveDigit || "-"}
        </div>
      </div>
    </div>
  );
}
