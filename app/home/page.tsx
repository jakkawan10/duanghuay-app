"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";

type UserDoc = {
  selectedGod?: string;      // เทพฟรีที่เลือก
  paidGods?: string[];       // เทพที่ปลดล็อกแล้ว
  planTier?: 0 | 1 | 2 | 3;  // จำนวนเทพที่อนุญาตให้ปลดล็อกเพิ่ม (1/2/3)
  expireAt?: Timestamp;      // วันหมดอายุสิทธิ์
};

const GODS = [
  { id: "sroiboon", name: "เจ้าแม่สร้อยบุญ", color: "from-pink-200 to-pink-300" },
  { id: "intra", name: "เจ้าองค์อินทร์แสนดี", color: "from-blue-200 to-blue-300" },
  { id: "maneewitch", name: "เจ้ามณีเวทยมนต์", color: "from-yellow-200 to-yellow-300" },
  { id: "dandok", name: "เจ้าแม่ดานดอกษ์ศ์", color: "from-green-200 to-green-300" },
];

const PRICING: Record<1 | 2 | 3, number> = { 1: 159, 2: 259, 3: 299 };
const QR_IMAGES: Record<1 | 2 | 3, string> = {
  1: "/qr/159.png",
  2: "/qr/259.png",
  3: "/qr/299.png",
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [udoc, setUdoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showPay, setShowPay] = useState(false);
  const [pendingGod, setPendingGod] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data() as UserDoc;
        setUdoc({
          selectedGod: d.selectedGod ?? undefined,
          paidGods: d.paidGods ?? [],
          planTier: (d.planTier ?? 0) as 0 | 1 | 2 | 3,
          expireAt: d.expireAt,
        });
      } else {
        // สร้างเอกสารเปล่าไว้ก่อน
        await setDoc(ref, { planTier: 0, paidGods: [] }, { merge: true });
        setUdoc({ selectedGod: undefined, paidGods: [], planTier: 0 });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const extraUsed = useMemo(() => (udoc?.paidGods?.length ?? 0), [udoc]);
  const slots = useMemo(() => (udoc?.planTier ?? 0), [udoc]);
  const slotsLeft = Math.max(0, slots - extraUsed);

  const handleSelectGod = async (godId: string) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    if (!udoc) return;

    // 1) ยังไม่เคยเลือกฟรี → บันทึกเทพฟรีแล้วเข้าได้เลย
    if (!udoc.selectedGod) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { selectedGod: godId, updatedAt: serverTimestamp() }, { merge: true });
      setUdoc((p) => ({ ...(p ?? {}), selectedGod: godId }));
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    // 2) ถ้าเป็นเทพที่มีสิทธิ์อยู่แล้ว (ฟรี/เคยปลดล็อก) → เข้าได้เลย
    if (udoc.selectedGod === godId || (udoc.paidGods || []).includes(godId)) {
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    // 3) ยังมี slot เหลือในแผนปัจจุบัน → ใช้สิทธิ์เพิ่มแล้วเข้า
    if (slotsLeft > 0) {
      const ref = doc(db, "users", user.uid);
      const nextPaid = [...(udoc.paidGods || []), godId];
      await setDoc(
        ref,
        { paidGods: nextPaid, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setUdoc((p) => ({ ...(p ?? {}), paidGods: nextPaid }));
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    // 4) ไม่มีสิทธิ์เหลือ → เปิดหน้าชำระเงินตาม "tier" (จำนวนเทพที่ต้องการปลด)
    setPendingGod(godId);
    setShowPay(true);
  };

  // tier ที่แนะนำให้พอสำหรับ "ปลดเพิ่ม 1 เทพ" จากสถานะปัจจุบัน
  const recommendedTier: 1 | 2 | 3 = useMemo(() => {
    const need = extraUsed + 1; // ต้องการปลดรวม (ไม่รวมเทพฟรี)
    if (need <= 1) return 1;
    if (need === 2) return 2;
    return 3;
  }, [extraUsed]);

  const requestPayment = async (tier: 1 | 2 | 3) => {
    if (!user) return;

    // บันทึกคำขอชำระเงินเพื่อให้แอดมินอนุมัติ (manual verify)
    const base = collection(db, "users", user.uid, "payment_requests");
    await addDoc(base, {
      tier,
      price: PRICING[tier],
      months: 1,
      targetGod: pendingGod, // เทพที่ผู้ใช้กำลังจะปลด
      createdAt: serverTimestamp(),
      status: "pending", // รอแอดมินอนุมัติ แล้วค่อย set planTier/expireAt จริง
    });

    alert("ส่งคำขอชำระเงินแล้ว กรุณาอัปโหลดสลิป/แจ้งแอดมินเพื่ออนุมัติสิทธิ์");
    setShowPay(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-center font-bold mb-6">
        คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัครแพ็กเกจ (รายเดือน)
      </h2>

      {/* User zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {GODS.map((g) => (
          <button
            key={g.id}
            onClick={() => handleSelectGod(g.id)}
            className={`p-6 rounded-xl shadow bg-gradient-to-r ${g.color} text-lg font-semibold hover:brightness-105 transition`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Admin Zone (คง UI เดิมไว้ให้พี่) */}
      <h3 className="text-center font-bold mb-4">🔑 Admin Zone</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GODS.map((g) => (
          <button
            key={g.id}
            onClick={() => router.push(`/admin/prediction/${g.id}`)}
            className="p-5 rounded-lg border bg-gray-50 hover:bg-gray-100 text-left"
          >
            ✏️ แก้เลข {g.name}
          </button>
        ))}
      </div>

      {/* Payment Modal */}
      {showPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-center mb-2">ปลดล็อกเทพเพิ่ม (อายุสิทธิ์ 1 เดือน)</h4>
            <p className="text-center text-gray-600 mb-6">
              ตอนนี้คุณปลดเพิ่มแล้ว {extraUsed} เทพ • แผนปัจจุบันรองรับ {slots} เทพ
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((t) => (
                <div
                  key={t}
                  className={`rounded-xl border p-4 text-center ${t === recommendedTier ? "ring-2 ring-amber-400" : ""}`}
                >
                  <div className="text-lg font-semibold mb-1">
                    ปลดล็อกเพิ่ม {t} เทพ
                  </div>
                  <div className="text-2xl font-extrabold mb-2">{PRICING[t as 1|2|3]}฿/เดือน</div>
                  <img
                    src={QR_IMAGES[t as 1|2|3]}
                    alt={`QR ${PRICING[t as 1|2|3]} บาท`}
                    className="w-full max-w-[220px] mx-auto rounded mb-3 border"
                  />
                  <button
                    onClick={() => requestPayment(t as 1|2|3)}
                    className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
                  >
                    ชำระด้วย QR นี้
                  </button>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              หลังชำระแล้ว กด “ส่งคำขอชำระเงิน” ระบบจะรอแอดมินยืนยันสิทธิ์ (อัปเดตแผนและวันหมดอายุให้)
            </p>

            <div className="flex justify-center gap-3 mt-5">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setShowPay(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
