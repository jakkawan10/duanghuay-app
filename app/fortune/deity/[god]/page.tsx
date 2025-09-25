"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function DeityFortunePage() {
  const { god } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "predictions", god as string);
      const snap = await getDoc(ref);
      if (snap.exists()) setData(snap.data());
    };
    fetchData();
  }, [god]);

  if (!data) {
    return <p className="text-center text-red-500 mt-10">❌ ไม่พบข้อมูล</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {/* รูปเทพ */}
      <Image
        src={`/images/${god}.png`}
        alt={god as string}
        width={300}
        height={300}
        className="mx-auto mb-6"
      />

      <h1 className="text-2xl font-bold mb-6">เลขเด็ดงวดนี้</h1>

      <p className="mb-2">วิ่งโดดตัวเดียว: <b>{data.single}</b></p>
      <p className="mb-4">ยิงเดี่ยวรอง: <b>{data.backup}</b></p>

      <p className="mb-2">2 ตัว: {data.double?.join(" , ")}</p>
      <p className="mb-2">3 ตัว: {data.triple?.join(" , ")}</p>
      <p className="mb-2">4 ตัว: {data.quad?.join(" , ")}</p>
      <p className="mb-2">5 ตัว: {data.penta?.join(" , ")}</p>

      <button className="mt-6 bg-teal-400 text-white py-2 px-6 rounded-lg">
        เข้าดูดวงได้ที่ เทพAI
      </button>
    </div>
  );
}
