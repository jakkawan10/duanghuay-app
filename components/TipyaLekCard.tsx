"use client";

import { useEffect, useState } from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // ใช้ client SDK
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TipyaLekCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const checkSession = async () => {
      const q = query(
        collection(doc(db, "users", user.uid), "ai_sessions"),
        where("deity", "==", "tipyalek")
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setSession({ id: snap.docs[0].id, ...data });
      }
    };
    checkSession();
  }, [user]);

  const handleBuyClick = async () => {
    if (!user) return;
    const payRef = doc(collection(db, "payment_requests"));
    await setDoc(payRef, {
      id: payRef.id,
      userId: user.uid,
      method: "qr",
      status: "pending", // 🟡 เริ่มจาก pending
      createdAt: serverTimestamp(),
      amount: 299,
      type: "tipyalek",
    });
    alert("สร้างคำขอชำระเงินแล้ว กรุณาสแกน QR เพื่อจ่ายเงิน");
    // reload session
    setSession({ status: "pending" });
  };

  const handleEnterClick = () => {
    router.push("/ai/tipyalek");
  };

  return (
    <Card className="border-2 border-yellow-500 shadow-lg mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold text-yellow-700">องค์ทิพยเลข</h2>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          เลขเด็ดที่ผ่านการคำนวณจากสถิติกองสลากย้อนหลังหลายปี และประมวลผลด้วย AI
          อัจฉริยะ
        </p>
        <p className="text-xs text-gray-500">
          ผลลัพธ์เป็นแนวโน้มเชิงสถิติ โปรดใช้วิจารณญาณในการตัดสินใจ
        </p>
      </CardContent>
      <CardFooter>
        {/* 🔥 แบ่ง 3 เงื่อนไข */}
        {!session && (
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
            onClick={handleBuyClick}
          >
            ซื้อสิทธิ์ 299 บาท/ครั้ง (ใช้ได้ 1 ชั่วโมง)
          </Button>
        )}

        {session?.status === "pending" && (
          <Button
            className="bg-gray-400 text-white w-full cursor-not-allowed"
            disabled
          >
            🟡 รอสแกน/ยืนยันการชำระ...
          </Button>
        )}

        {session?.status === "active" && (
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
            onClick={handleEnterClick}
          >
            เข้าสู่ห้ององค์ทิพยเลข
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
