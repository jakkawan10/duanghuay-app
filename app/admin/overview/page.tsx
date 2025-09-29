"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Prediction = {
  oneDigit?: string;
  onePair?: string;
  twoDigit?: string;
  threeDigit?: string;
  fourDigit?: string;
  fiveDigit?: string;
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<Record<string, Prediction>>({});

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "predictions"));
      const obj: Record<string, Prediction> = {};
      snap.forEach((doc) => {
        obj[doc.id] = doc.data() as Prediction;
      });
      setData(obj);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">👁️ ดูเลขทุกเทพ</h1>

      <div className="space-y-6">
        {Object.entries(data).map(([godId, pred]) => (
          <div key={godId} className="p-4 border rounded-lg shadow bg-white">
            <h2 className="text-lg font-semibold mb-2">🔮 {godId}</h2>
            <p>วิ่งโดด: {pred.oneDigit || "-"}</p>
            <p>ยิงเดี่ยวรอง: {pred.onePair || "-"}</p>
            <p>2 ตัว: {pred.twoDigit || "-"}</p>
            <p>3 ตัว: {pred.threeDigit || "-"}</p>
            <p>4 ตัว: {pred.fourDigit || "-"}</p>
            <p>5 ตัว: {pred.fiveDigit || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
