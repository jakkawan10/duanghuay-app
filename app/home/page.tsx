'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const gods = [
  { id: 'sroiboon', name: 'เจ้าแม่สร้อยบุญ', color: 'bg-pink-200' },
  { id: 'intra', name: 'เจ้าองค์อินทร์แสนดี', color: 'bg-blue-200' },
  { id: 'maneewitch', name: 'เจ้ามณีเวทยมนต์', color: 'bg-yellow-200' },
  { id: 'dandok', name: 'เจ้าแม่ดานดอกษ์ศ์', color: 'bg-green-200' },
  { id: 'ai-god', name: 'เทพ AI เลขเด็ดสุดล้ำ', color: 'bg-red-200' },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedGod, setSelectedGod] = useState<string | null>(null);
  const [isVIP, setIsVIP] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSelectedGod(snap.data().selectedGod || null);
        setIsVIP(snap.data().isVIP || false);
      }
    };
    fetchUser();
  }, [user]);

  const handleSelectGod = async (godId: string) => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    // ถ้ายังไม่ได้เลือก หรือเป็น VIP
    if (!selectedGod || isVIP) {
      try {
        const ref = doc(db, 'users', user.uid);
        await setDoc(
          ref,
          { selectedGod: godId },
          { merge: true }
        );
        setSelectedGod(godId);
        router.push(`/fortune/deity/${godId}`);
      } catch (err) {
        console.error(err);
        toast.error('เกิดข้อผิดพลาด');
      }
    } else if (selectedGod && !isVIP && godId !== selectedGod) {
      // User ธรรมดาเลือกเพิ่ม
      alert('คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัคร VIP');
    } else {
      router.push(`/fortune/deity/${godId}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-center font-bold mb-6">
        คุณเลือกได้ฟรีเพียง 1 เทพ หากต้องการดูเทพเพิ่ม กรุณาสมัคร VIP
      </h1>

      {/* User Zone */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {gods.map((god) => (
          <Button
            key={god.id}
            onClick={() => handleSelectGod(god.id)}
            className={`${god.color} p-6 text-lg font-bold`}
          >
            {god.name}
          </Button>
        ))}
      </div>

      {/* Admin Zone */}
      <h2 className="text-center font-bold mb-4">🔑 Admin Zone</h2>
      <div className="grid grid-cols-2 gap-4">
        {gods.slice(0, 4).map((god) => (
          <Button
            key={god.id}
            onClick={() => router.push(`/admin/prediction/${god.id}`)}
            variant="outline"
            className="p-6"
          >
            ✏️ แก้เลข {god.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
