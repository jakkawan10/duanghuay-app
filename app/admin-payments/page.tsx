"use client";

import { useEffect, useState } from "react";
import {
  db
} from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type Payment = {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  type: string; // "tipyalek" หรือ package อื่น
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "payment_requests"));
      const list: Payment[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        list.push({
          id: d.id,
          userId: data.userId,
          amount: data.amount,
          status: data.status,
          type: data.type,
        });
      });
      setPayments(list);
      setLoading(false);
    };
    load();
  }, []);

  const approvePayment = async (p: Payment) => {
    try {
      // ✅ อัปเดตสถานะเป็น approved
      await updateDoc(doc(db, "payment_requests", p.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
      });

      // ✅ ถ้าเป็น Tipyalek → สร้าง session 1 ชั่วโมง
      if (p.type === "tipyalek") {
        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h

        const sessionRef = doc(collection(db, "sessions"));
        await setDoc(sessionRef, {
          userId: p.userId,
          deity: "tipyalek",
          status: "active",
          startTime: start,
          endTime: end,
          amount: p.amount,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("อนุมัติเรียบร้อย + สร้าง session สำเร็จ");
    } catch (e) {
      console.error(e);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Admin Payments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        payments.map((p) => (
          <Card key={p.id} className="p-4">
            <CardContent>
              <p>userId: {p.userId}</p>
              <p>amount: {p.amount}</p>
              <p>status: {p.status}</p>
              <p>type: {p.type}</p>
              {p.status === "pending" && (
                <Button
                  className="bg-green-600 text-white mt-2"
                  onClick={() => approvePayment(p)}
                >
                  ✅ อนุมัติ
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
