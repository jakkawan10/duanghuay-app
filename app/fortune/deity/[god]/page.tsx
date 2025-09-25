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

    // ใช้ realtime sync
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data() as PredictionData);
      }
    });

    return () => unsub();
  }, [god]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center text-white">
      <h1 className="text-2xl font-bold mb-4">เทพ {god}</h1>
      <p className="mb-6">ผู้ประทานโชคลาภและความมั่งคั่ง</p>

      {/* วิ่งโดดตัวเดียว */}
      <div className="mb-4">
        <p className="font-semibold">วิ่งโดดตัวเดียว</p>
        <div className="bg-white text-black py-2">{data?.oneDigit || "-"}</div>
      </div>

      {/* ยิงเดี่ยวรอง */}
      <div className="mb-4">
        <p className="font-semibold">ยิงเดี่ยวรอง</p>
        <div className="bg-white text-black py-2">{data?.onePair || "-"}</div>
      </div>

      {/* 2 ตัวเป้า */}
      <div className="mb-4">
        <p className="font-semibold">2 ตัวเป้า</p>
        <div className="bg-white text-black py-2">{data?.twoDigit || "-"}</div>
      </div>

      {/* 3 ตัววิน */}
      <div className="mb-4">
        <p className="font-semibold">3 ตัววิน</p>
        <div className="bg-white text-black py-2">{data?.threeDigit || "-"}</div>
      </div>

      {/* 4 ตัวรับทรัพย์ */}
      <div className="mb-4">
        <p className="font-semibold">4 ตัวรับทรัพย์</p>
        <div className="bg-white text-black py-2">{data?.fourDigit || "-"}</div>
      </div>

      {/* 5 ตัวรวยไว */}
      <div className="mb-4">
        <p className="font-semibold">5 ตัวรวยไว</p>
        <div className="bg-white text-black py-2">{data?.fiveDigit || "-"}</div>
      </div>
    </div>
  );
}
