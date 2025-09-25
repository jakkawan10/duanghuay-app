'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

type Payment = {
  id: string;
  userId: string;
  package: number;
  amount: number;
  slipUrl: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'payments'));
      const list: Payment[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        list.push({
          id: d.id,
          userId: data.userId,
          package: data.package,
          amount: data.amount,
          slipUrl: data.slipUrl,
          status: data.status,
        });
      });
      setPayments(list);
      setLoading(false);
    };
    load();
  }, []);

  const handleApprove = async (payment: Payment) => {
    try {
      // 1) อัปเดต payment → approved
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
      });

      // 2) อัปเดต user → vipLevel + vipUntil (+30 วัน)
      const userRef = doc(db, 'users', payment.userId);
      const until = new Date();
      until.setMonth(until.getMonth() + 1);

      await updateDoc(userRef, {
        vipLevel: `god${payment.package}`,
        vipUntil: until,
        updatedAt: serverTimestamp(),
      });

      toast.success(`อนุมัติการชำระเงินของ User ${payment.userId} แล้ว`);
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const handleReject = async (payment: Payment) => {
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
      });
      toast.success('ปฏิเสธการชำระเงินเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: ตรวจสอบการชำระเงิน</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments
          .filter((p) => p.status === 'pending')
          .map((p) => (
            <Card key={p.id} className="p-4">
              <CardContent>
                <p className="font-semibold">User: {p.userId}</p>
                <p>แพ็กเกจ: God{p.package}</p>
                <p>ยอดเงิน: {p.amount} บาท</p>
                <p>สถานะ: {p.status}</p>
                <a
                  href={p.slipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  ดูสลิป
                </a>

                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleApprove(p)}>✅ อนุมัติ</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(p)}
                  >
                    ❌ ปฏิเสธ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
