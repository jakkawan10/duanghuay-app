"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface PredictionData {
  oneDigit?: string;
  onePair?: string;
  twoDigit?: string;
  threeDigit?: string;
  fourDigit?: string;
  fiveDigit?: string;
}

export default function DeityPage() {
  const { god } = useParams(); // เช่น sroiboon, maneewitch, intra, dandok
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📌 ให้ Admin เป็นคนกำหนดวันที่เองตอนกรอก
  // ฝั่ง User เราจะ fix ไว้เป็น "ล่าสุดที่ Admin ใส่"
  // ตอนนี้เพื่อความง่ายพี่กรอกวันที่เองตรงนี้ เช่น "2025-09-25"
  const dateKey = "2025-09-25";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!god) return;
        const ref = doc(db, "predictions", god as string, "dates", dateKey);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setData(snap.data() as PredictionData);
        } else {
          setError("ไม่พบข้อมูล");
        }
      } catch (err: any) {
        console.error(err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [god, dateKey]);

  if (loading) return <p>⏳ กำลังโหลด...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        คำทำนายจาก {god}
      </h1>

      {data ? (
        <div className="space-y-2">
          <p>เลข 1 ตัว : {data.oneDigit || "-"}</p>
          <p>เลขคู่ : {data.onePair || "-"}</p>
          <p>เลข 2 ตัว : {data.twoDigit || "-"}</p>
          <p>เลข 3 ตัว : {data.threeDigit || "-"}</p>
          <p>เลข 4 ตัว : {data.fourDigit || "-"}</p>
          <p>เลข 5 ตัว : {data.fiveDigit || "-"}</p>
        </div>
      ) : (
        <p>ไม่พบข้อมูล</p>
      )}
    </div>
  );
}
