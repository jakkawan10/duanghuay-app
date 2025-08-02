'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<'premium' | 'vip' | null>(null);

  useEffect(() => {
    const selectedPlan = searchParams.get('plan') as 'premium' | 'vip' | null;
    setPlan(selectedPlan);
  }, [searchParams]);

  const handleConfirm = async () => {
    if (!plan) return;

    try {
      toast({
        title: `สมัครแผน ${plan === 'premium' ? 'Premium' : 'VIP'} สำเร็จ`,
        description: 'คุณสามารถใช้งานสิทธิ์ได้ทันที',
      });
      router.push('/profile');
    } catch (err) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'กรุณาลองใหม่ภายหลัง',
        variant: 'destructive',
      });
    }
  };

  const planDetails = {
    premium: {
      title: '💎 Premium',
      price: '399 บาท / เดือน',
      benefits: ['ดูดวงแม่นระดับกลาง', 'เจาะลึกโชคลาภรายสัปดาห์', 'ไม่แสดงโฆษณา'],
    },
    vip: {
      title: '👑 VIP',
      price: '999 บาท / เดือน',
      benefits: ['เข้าถึงดวงลับเฉพาะ', 'วิเคราะห์เลขเด็ด AI ขั้นสูง', 'สิทธิพิเศษสำหรับสมาชิก VIP เท่านั้น'],
    },
  };

  if (!plan) {
    return <p className="text-center mt-10">กรุณาเลือกแผนการใช้งานจากหน้า /plan ก่อน</p>;
  }

  const { title, price, benefits } = planDetails[plan];

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-xl font-bold text-primary">{price}</p>
          <ul className="list-disc ml-6 my-4 text-sm text-muted-foreground space-y-1">
            {benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <Button className="w-full mt-4" onClick={handleConfirm}>
            ยืนยันการสมัครใช้งาน
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
