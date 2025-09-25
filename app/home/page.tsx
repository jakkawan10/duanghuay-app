"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const gods = [
  { id: "sroiboon", name: "เจ้าแม่สร้อยบุญ", color: "from-pink-200 to-pink-400" },
  { id: "maneewitch", name: "เจ้ามณีเวทยมนต์", color: "from-yellow-200 to-yellow-400" },
  { id: "intra", name: "เจ้าองค์อินทร์แสนดี", color: "from-blue-200 to-blue-400" },
  { id: "dandok", name: "เจ้าแม่ดานดอกษ์ศ์", color: "from-green-200 to-green-400" },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedGod, setSelectedGod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดสิทธิ์จาก Firestore
  useEffect(() => {
    const fetchSelection = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSelectedGod(snap.data().selectedGod || null);
      }
      setLoading(false);
    };
    fetchSelection();
  }, []);

  const handleSelectGod = async (godId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (!selectedGod) {
      // ยังไม่เคยเลือก → บันทึก
      await setDoc(doc(db, "users", user.uid), {
        selectedGod: godId,
        createdAt: new Date(),
      });
      setSelectedGod(godId);
      router.push(`/fortune/deity/${godId}`);
    } else if (selectedGod === godId) {
      // เลือกซ้ำเทพเดิม → เข้าได้
      router.push(`/fortune/deity/${godId}`);
    } else {
      // เลือกเทพใหม่ → ขึ้นเตือน
      alert("คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัคร VIP");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-bold">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัคร VIP
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {gods.map((god) => (
          <button
            key={god.id}
            onClick={() => handleSelectGod(god.id)}
            className={`p-8 rounded-2xl shadow-lg bg-gradient-to-r ${god.color} 
              text-xl font-semibold hover:scale-105 transition transform`}
          >
            {god.name}
          </button>
        ))}
      </div>

      {selectedGod && (
        <p className="mt-6 text-green-700 font-medium">
          ✅ คุณได้เลือก {gods.find((g) => g.id === selectedGod)?.name} แล้ว
        </p>
      )}
    </div>
  );
}
