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

  // Modal ปกติ (1–3 เทพ)
  const [showPay, setShowPay] = useState(false);
  const [pendingGod, setPendingGod] = useState<string | null>(null);

  // Modal Tipyalek (Dynamic QR)
  const [showTipyaQR, setShowTipyaQR] = useState(false);
  const [creating, setCreating] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<
    "idle" | "pending" | "successful" | "failed"
  >("idle");

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

  async function openTipyaPay() {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowTipyaQR(true);
    try {
      setCreating(true);
      const res = await fetch("/api/payments/create-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, product: "tipyalek", amount: 299 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Create QR failed");
      setQrImage(json.qrImage);
      setPayStatus("pending");
    } catch (e: any) {
      alert(e.message || "ไม่สามารถสร้าง QR ได้");
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;

  console.log("udoc state:", udoc);

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

      {/* ปุ่ม องค์ทิพยเลข */}
      <div className="flex justify-center mb-10">
        <button
          onClick={openTipyaPay}
          className="w-64 h-64 p-6 rounded-2xl shadow-lg 
            bg-gradient-to-r from-purple-500 to-pink-500 
            text-white font-bold text-center whitespace-pre-line 
            hover:scale-105 transition transform"
        >
          ✨ องค์ทิพยเลข ✨{"\n"}
          ห้องสนทนาพิเศษ ถามได้ทั้งเลขเด็ด{"\n"}
          ดูดวง และคำทำนายส่วนตัว{"\n"}
          ใช้สถิติจริง + การพยากรณ์
        </button>
      </div>

      {/* Admin Zone */}
      {udoc?.role === "admin" && (
        <>
          <h3 className="text-center font-bold mb-4">🔑 Admin Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/admin/overview")}
              className="px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-bold text-black shadow"
            >
              👁️ ดูเลขทุกเทพ
            </button>
          </div>
        </>
      )}

      {/* Modal 1–3 เทพ */}
      {showPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6">
            <h4 className="text-xl font-bold text-center mb-2">
              ปลดล็อกเทพเพิ่ม (อายุสิทธิ์ 1 เดือน)
            </h4>
            <p className="text-center text-gray-600 mb-6">
              ตอนนี้คุณปลดเพิ่มแล้ว {extraUsed} เทพ • แผนปัจจุบันรองรับ {slots} เทพ
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((t) => (
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
                    onClick={() => requestPayment(t as 1 | 2 | 3)}
                    className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
                  >
                    ชำระด้วย QR นี้
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <button className="px-4 py-2 rounded border" onClick={() => setShowPay(false)}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tipyalek */}
      {showTipyaQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-xl font-bold text-center mb-2">ซื้อสิทธิ์คุยกับองค์ทิพยเลข</h3>
            <p className="text-center text-sm mb-4">299 บาท / 1 ชั่วโมง</p>
            <div className="flex flex-col items-center justify-center border p-3 mb-4">
              {creating && <div>กำลังสร้าง QR...</div>}
              {!creating && qrImage && <img src={qrImage} alt="QR" className="w-56 h-56" />}
            </div>
            {payStatus === "pending" && (
              <div className="text-center text-yellow-700">รอการชำระเงิน...</div>
            )}
            {payStatus === "successful" && (
              <div className="text-center text-green-700 font-bold">
                ✅ จ่ายเงินสำเร็จ! เข้าห้องได้แล้ว
              </div>
            )}
            {payStatus === "failed" && (
              <div className="text-center text-red-600 font-bold">❌ จ่ายไม่สำเร็จ</div>
            )}
            <div className="flex justify-center gap-2 mt-5">
              <button className="px-4 py-2 rounded border" onClick={() => setShowTipyaQR(false)}>
                ปิด
              </button>
              <button
                className="px-4 py-2 rounded bg-purple-600 text-white"
                onClick={() => router.push("/fortune/tipyalek")}
              >
                เข้าห้ององค์ทิพยเลข
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
