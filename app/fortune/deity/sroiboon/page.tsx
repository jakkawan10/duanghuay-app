'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/store/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const now = new Date();
const day = now.getDate() < 16 ? '01' : '16';
const month = `${now.getMonth() + 1}`.padStart(2, '0');
const year = now.getFullYear();
const roundKey = `${year}-${month}-${day}`;

const defaultData = {
  oneDigit: '',
  onePair: '',
  twoDigit: '',
  threeDigit: '',
  fourDigit: '',
  fiveDigit: '',
};

export default function SorayboonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.email === 'duyduy2521@gmail.com';

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ref = doc(db, 'sroiboon', roundKey);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) setData(snap.data() as typeof defaultData);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(ref, data);
    setSaving(false);
    alert('บันทึกสำเร็จ');
  };

  const renderInput = (label: string, key: keyof typeof defaultData, placeholder: string) => (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1">{label}</label>
      {isAdmin ? (
        <input
          className="w-full p-2 border rounded"
          value={data[key]}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
          placeholder={placeholder}
        />
      ) : (
        <div className="p-2 border rounded bg-gray-100">{data[key] || '—'}</div>
      )}
    </div>
  );

  if (loading) return <p className="p-4 text-white">กำลังโหลด...</p>;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">✨ เจ้าแม่สร้อยบุญ ✨</h1>
      <p className="text-sm text-gray-400 mb-6">
        ท่านคือเทพแห่งโชคลาภ การค้าขาย ความสำเร็จ และการอธิษฐานสำเร็จ
      </p>

      <Image
        src="/images/sroiboon.png"
        alt="เจ้าแม่สร้อยบุญ"
        width={240}
        height={240}
        className="rounded-xl mb-6 shadow-md"
      />

      <div className="bg-white text-black rounded-xl p-4 w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">เลขเด็ดงวด {roundKey}</h2>

        {renderInput('วิ่งโดดตัวเดียว', 'oneDigit', 'เช่น 9')}
        {renderInput('ยิงเดี่ยวรอง', 'onePair', 'เช่น 7')}
        {renderInput('2 ตัวเป้า', 'twoDigit', 'เช่น 67 32')}
        {renderInput('3 ตัวแม่สร้อยบุญ', 'threeDigit', 'เช่น 562 801')}
        {renderInput('4 ตัวขนทรัพย์', 'fourDigit', 'เช่น 7520 9851')}
        {renderInput('5 ตัวรวยไว', 'fiveDigit', 'เช่น 15897 30006')}

        {isAdmin && (
          <button
            onClick={save}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {saving ? 'กำลังบันทึก...' : '💾 บันทึกเลขเด็ด'}
          </button>
        )}
      </div>

      <button
        onClick={() => router.push('/fortune')}
        className="bg-yellow-400 px-6 py-2 rounded-full text-black font-semibold"
      >
        🔮 กลับสู่หน้าเทพทำนายดวง
      </button>
    </main>
  );
}
