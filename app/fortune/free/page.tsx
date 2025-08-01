'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function FortuneFreePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-4">🔮 เบิกญาณทำนายชะตา (Free)</h1>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <p className="text-gray-800">ฟีเจอร์สำหรับผู้ใช้ฟรี:</p>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            <li>ทำนายแบบข้อความตามวันเกิด เดือนเกิด ปีเกิด</li>
            <li>ไม่สามารถถามตอบได้</li>
            <li>ต้องอัปเกรดเป็น Premium หรือ VIP เพื่อใช้งานฟีเจอร์เต็มรูปแบบ</li>
          </ul>
          <div className="mt-6">
            <p className="text-center text-gray-600">(ระบบกำลังพัฒนาแบบทำนายด้วยคำถามเร็ว ๆ นี้)</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
