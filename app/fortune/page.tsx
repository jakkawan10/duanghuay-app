// app/fortune/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function FortunePage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setStatus(data.status || "free");
      } else {
        setStatus("free");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleClick = (level: string) => {
    if (level === "free") router.push("/fortune/free");
    else if (level === "premium") {
      if (status === "premium" || status === "vip") router.push("/fortune/premium");
      else alert("เฉพาะสมาชิก Premium หรือ VIP เท่านั้น");
    } else if (level === "vip") {
      if (status === "vip") router.push("/fortune/vip");
      else alert("เฉพาะสมาชิก VIP เท่านั้น");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-purple-100 to-blue-100">
      <h1 className="text-2xl font-bold mb-6">🔮 เลือกรูปแบบการเบิกญาณ</h1>

      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => handleClick("free")}
          className="w-full bg-white shadow p-4 rounded-xl text-left border hover:bg-gray-50"
        >
          <p className="text-lg font-semibold">🆓 Free</p>
          <p className="text-sm text-gray-600">ทำนายจากวัน/เดือน/ปีเกิด แบบข้อความ</p>
        </button>

        <button
          onClick={() => handleClick("premium")}
          className="w-full bg-white shadow p-4 rounded-xl text-left border hover:bg-gray-50"
        >
          <p className="text-lg font-semibold">💎 Premium</p>
          <p className="text-sm text-gray-600">ถามตอบกับหมอดู AI (จำกัดข้อความ)</p>
        </button>

        <button
          onClick={() => handleClick("vip")}
          className="w-full bg-white shadow p-4 rounded-xl text-left border hover:bg-gray-50"
        >
          <p className="text-lg font-semibold">👑 VIP</p>
          <p className="text-sm text-gray-600">ถามตอบได้ทุกเรื่องแบบไม่จำกัด</p>
        </button>
      </div>
    </main>
  );
}
