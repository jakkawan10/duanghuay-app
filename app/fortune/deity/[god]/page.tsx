'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';

type LuckyData = {
  numbers: string[];
  summary: string;
  updatedAt: string;
};

const DeityPredictionPage = () => {
  const { god } = useParams();
  const [data, setData] = useState<LuckyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!god || typeof god !== 'string') return;

    const loadData = async () => {
      try {
        const ref = doc(firestore, god, 'latest');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data() as LuckyData);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [god]);

  if (loading) return <div className="p-6 text-center">⏳ กำลังโหลด...</div>;
  if (!data) return <div className="p-6 text-center text-red-600">❌ ไม่พบข้อมูล</div>;

  return (
    <div className="p-6 space-y-6">
      {/* รูปเทพ */}
      <div className="text-center">
        <Image
          src={`/images/${god}.png`}
          alt={String(god)}
          width={240}
          height={240}
          className="mx-auto rounded-xl shadow-lg"
        />
      </div>

      {/* เลขเด็ด */}
      <div className="text-center space-y-2">
        <div className="text-xl font-bold text-gray-800">เลขเด็ด</div>
        <div className="text-3xl font-semibold text-pink-600">
          {data.numbers.join(', ')}
        </div>
        <div className="text-sm text-gray-400">อัปเดตล่าสุด: {data.updatedAt}</div>
      </div>

      {/* คำอธิบาย */}
      <div className="text-gray-700 text-lg whitespace-pre-line">{data.summary}</div>

      {/* ปุ่มกลับ */}
      <div className="text-center pt-6">
        <Link href="/fortune">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-xl shadow-md">
            🔮 กลับหน้าเลือกเทพ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DeityPredictionPage;
