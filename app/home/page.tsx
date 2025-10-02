"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";

type UserDoc = {
  selectedGod?: string;
  paidGods?: string[];
  planTier?: 0 | 1 | 2 | 3;
  expireAt?: Timestamp;
  role?: string;
};

const GODS = [
  { id: "sroiboon", name: "เจ้าแม่สร้อยบุญ", color: "from-pink-200 to-pink-300" },
  { id: "intra", name: "เจ้าองค์อินทร์แสนดี", color: "from-blue-200 to-blue-300" },
  { id: "maneewitch", name: "เจ้ามณีเวทยมนต์", color: "from-yellow-200 to-yellow-300" },
  { id: "dandok", name: "เจ้าแม่ดานดอกษ์ศ์", color: "from-green-200 to-green-300" },
];

const PRICING: Record<1 | 2 | 3, number> = { 1: 159, 2: 259, 3: 299 };
const QR_IMAGES: Record<1 | 2 | 3, string> = {
  1: "/qr-payment.jpg",
  2: "/qr-payment.jpg",
  3: "/qr-payment.jpg",
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [udoc, setUdoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showPay, setShowPay] = useState(false);
  const [pendingGod, setPendingGod] = useState<string | null>(null);

  // 🆕 Modal Tipyalek
  const [showTipyalekPay, setShowTipyalekPay] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUdoc(snap.data() as UserDoc);
      } else {
        await setDoc(ref, { planTier: 0, paidGods: [], role: "user" }, { merge: true });
        setUdoc({ planTier: 0, paidGods: [], role: "user" });
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
      router.push("/login");
      return;
    }
    if (!udoc) return;

    if (udoc.role === "admin") {
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    if (!udoc.selectedGod) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { selectedGod: godId, updatedAt: serverTimestamp() }, { merge: true });
      setUdoc((p) => ({ ...(p ?? {}), selectedGod: godId }));
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    if (udoc.selectedGod === godId || (udoc.paidGods || []).includes(godId)) {
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    if (slotsLeft > 0) {
      const ref = doc(db, "users", user.uid);
      const nextPaid = [...(udoc.paidGods || []), godId];
      await setDoc(ref, { paidGods: nextPaid, updatedAt: serverTimestamp() }, { merge: true });
      setUdoc((p) => ({ ...(p ?? {}), paidGods: nextPaid }));
      router.push(`/fortune/deity/${godId}`);
      return;
    }

    setPendingGod(godId);
    setShowPay(true);
  };

  const recommendedTier: 1 | 2 | 3 = useMemo(() => {
    const need = extraUsed + 1;
    if (need <= 1) return 1;
    if (need === 2) return 2;
    return 3;
  }, [extraUsed]);

  const requestPayment = async (tier: 1 | 2 | 3) => {
    if (!user) return;

    const base = collection(db, "users", user.uid, "payment_requests");
    await addDoc(base, {
      tier,
      price: PRICING[tier],
      months: 1,
      targetGod: pendingGod,
      createdAt: serverTimestamp(),
      status: "pending",
    });

    alert("ส่งคำขอชำระเงินแล้ว กรุณาอัปโหลดสลิป/แจ้งแอดมินเพื่ออนุมัติสิทธิ์");
    setShowPay(false);
  };

  // 🆕 ฟังก์ชันขอจ่าย Tipyalek
  const requestPaymentTipyalek = async () => {
    if (!user) return;

    const base = collection(db, "users", user.uid, "payment_requests");
    await addDoc(base, {
      type: "tipyalek",
      price: 299,
      duration: 60, // นาที
      createdAt: serverTimestamp(),
      status: "pending",
    });

    alert("ส่งคำขอ Tipyalek แล้ว กรุณาอัปโหลดสลิป/แจ้งแอดมินเพื่ออนุมัติสิทธิ์");
    setShowTipyalekPay(false);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl">กำลังโหลด...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-center font-bold mb-6">
        คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัครแพ็กเกจ (รายเดือน)
      </h2>

      {/* ปุ่ม 4 เทพ */}
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

      {/* ปุ่มพิเศษ Tipyalek */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowTipyalekPay(true)}
          className="w-64 h-64 p-6 rounded-2xl shadow-lg 
                    bg-gradient-to-r from-purple-500 to-pink-500 
                    text-white font-bold text-center whitespace-pre-line 
                    hover:scale-105 transition transform"
        >
          ✨ องค์ทิพยเลข ✨{"\n"}
          ห้องสนทนาพิเศษ 299 บาท{"\n"}
          ใช้งานได้ 1 ชั่วโมงเต็ม{"\n"}
          ดูดวง + ถามเลขเด็ดเฉพาะ
        </button>
      </div>

      {/* Modal 3 ราคา (ปลดล็อกเทพรายเดือน) */}
      {showPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-center mb-4">ปลดล็อกเทพเพิ่ม (1 เดือน)</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {([1, 2, 3] as (1 | 2 | 3)[]).map((t) => (
                <div
                  key={t}
                  className={`rounded-xl border p-4 text-center ${
                    t === recommendedTier ? "ring-2 ring-amber-400" : ""
                  }`}
                >
                  <div className="text-lg font-semibold mb-1">ปลดล็อกเพิ่ม {t} เทพ</div>
                  <div className="text-2xl font-extrabold mb-2">{PRICING[t]}฿/เดือน</div>
                  <img
                    src={QR_IMAGES[t]}
                    alt={`QR ${PRICING[t]} บาท`}
                    className="w-full max-w-[220px] mx-auto rounded mb-3 border"
                  />
                  <button
                    onClick={() => requestPayment(t)}
                    className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
                  >
                    ชำระด้วย QR นี้
                  </button>
                </div>
              ))}

            </div>
            <div className="text-center mt-4">
              <button onClick={() => setShowPay(false)} className="px-4 py-2 rounded border">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tipyalek (299 บาท / 1 ชั่วโมง) */}
      {showTipyalekPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h4 className="text-xl font-bold text-center mb-4">💫 ซื้อสิทธิ์คุยกับองค์ทิพยเลข</h4>
            <p className="text-center text-gray-600 mb-4">
              จ่ายครั้งละ <b>299 บาท</b> ใช้ได้ <b>1 ชั่วโมง</b>
            </p>
            <img
              src="/qr-tipyalek.jpg"
              alt="QR 299 บาท"
              className="w-full max-w-[220px] mx-auto rounded mb-3 border"
            />
            <button
              onClick={requestPaymentTipyalek}
              className="w-full px-4 py-2 rounded bg-purple-600 text-white hover:opacity-90"
            >
              ✅ ยืนยันการชำระเงิน
            </button>
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowTipyalekPay(false)} className="px-4 py-2 rounded border">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
