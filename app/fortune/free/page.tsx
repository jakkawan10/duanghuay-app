'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const FreePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState('');

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
  }, []);

  const handleSubmit = () => {
    if (!birthDate) {
      setResult('กรุณากรอกวันเดือนปีเกิดของคุณก่อน');
      return;
    }

    // Mock คำทำนายแบบสุ่ม
    const predictions = [
      'วันนี้เป็นวันแห่งโอกาสใหม่ อย่าปล่อยให้มันหลุดมือ',
      'มีคนแอบคิดถึงคุณอยู่แบบลับๆ',
      'โชคเล็กๆ กำลังจะมา อย่าลืมหยอดกระปุก',
      'เรื่องที่คิดว่าแย่ จะกลายเป็นดีในไม่ช้า',
      'อดทนอีกนิด ความสำเร็จใกล้เข้ามาแล้ว'
    ];
    const random = predictions[Math.floor(Math.random() * predictions.length)];
    setResult(`🔮 คำทำนายสำหรับ ${birthDate}:\n${random}`);
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-100 px-4">
      <h1 className="text-2xl font-bold mb-4">🔮 เบิกญาณแบบ Free</h1>

      <input
        type="text"
        placeholder="กรอกวัน/เดือน/ปีเกิด เช่น 1/1/1990"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full max-w-md p-3 rounded border border-gray-300 mb-4 text-center"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        ทำนาย
      </button>

      {result && (
        <div className="mt-6 max-w-md bg-white border p-4 rounded shadow whitespace-pre-line text-center">
          {result}
        </div>
      )}
    </div>
  );
};

export default FreePage;
