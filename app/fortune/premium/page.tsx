'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getPrediction } from '@/lib/predict';

const PremiumPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const usageLimit = 3;

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

  const handleAsk = async () => {
    if (usageCount >= usageLimit) {
      setResponse('🚫 คุณใช้สิทธิครบแล้วสำหรับวันนี้ (Premium ได้ 3 ครั้ง/วัน)');
      return;
    }
    if (!input.trim()) return;

    setResponse('🧙‍♂️ กำลังทำนาย...');
    const reply = await getPrediction(input);
    setResponse(reply);
    setUsageCount((prev) => prev + 1);
    setInput('');
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-100 px-4">
      <h1 className="text-2xl font-bold mb-4">💎 เบิกญาณ Premium</h1>

      <textarea
        placeholder="พิมพ์คำถามของคุณ เช่น การเงิน ความรัก ฯลฯ"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full max-w-md p-3 rounded border border-gray-300 mb-4"
        rows={4}
      />

      <button
        onClick={handleAsk}
        className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
      >
        ถามเลย
      </button>

      <div className="mt-4 text-sm text-gray-600">
        ใช้ไปแล้ว: {usageCount} / {usageLimit} ครั้ง
      </div>

      {response && (
        <div className="mt-6 max-w-md bg-white border p-4 rounded shadow whitespace-pre-line text-center">
          {response}
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
