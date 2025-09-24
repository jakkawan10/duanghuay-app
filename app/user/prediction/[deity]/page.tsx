"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { getTodayKey } from "@/lib/dateUtils";

export default function PredictionPage() {
  const params = useParams();
  const god = params?.god as string; // เช่น sroiboon, maneewitch, intra, dandok
  const todayKey = getTodayKey();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!god) return;
    const fetchData = async () => {
      const ref = doc(db, "predictions", god); // ใช้ชื่อเทพเป็น doc
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data()[todayKey]);
      }
    };
    fetchData();
  }, [god, todayKey]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>{god}</h1>
      <p>{data}</p>
    </div>
  );
}
