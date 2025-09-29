"use client";

import { useEffect, useState } from "react";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TipyaLekCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const checkSession = async () => {
      const q = query(
        collection(db, "users", user.uid, "ai_sessions"),
        where("status", "==", "active")
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const session = snap.docs[0].data();
        setActiveSession({ id: snap.docs[0].id, ...session });
      }
    };
    checkSession();
  }, [user]);

  const handleBuyClick = async () => {
    if (!user) return;

    // ➕ สร้าง payment_requests
    const payRef = doc(collection(db, "payment_requests"));
    await setDoc(payRef, {
      id: payRef.id,
      userId: user.uid,
      method: "qr",
      status: "pending",
      createdAt: serverTimestamp(),
      amount: 299,
      type: "tipyalek",
    });

    alert("สร้างคำขอชำระเงินแล้ว รอการยืนยันจาก Admin");
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
        {activeSession ? (
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
            onClick={handleEnterClick}
          >
            เข้าสู่ห้ององค์ทิพยเลข
          </Button>
        ) : (
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
            onClick={handleBuyClick}
          >
            ซื้อสิทธิ์ 299 บาท/ครั้ง (ใช้ได้ 1 ชั่วโมง)
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
