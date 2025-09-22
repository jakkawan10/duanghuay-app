'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const deityOptions = [
  { label: 'เจ้าแม่สร้อยบุญ', value: 'sroiboon' },
  { label: 'เจ้ามณีเวทยมนต์', value: 'maneewitch' },
  { label: 'เจ้าองค์อินทร์แสนดี', value: 'intra' },
  { label: 'เจ้าแม่ดานดอกษ์ศ์', value: 'dandok' },
];

export default function AdminLuckyPage() {
  const [deity, setDeity] = useState('sroiboon');
  const [solo, setSolo] = useState('');
  const [singleBackup, setSingleBackup] = useState('');
  const [double, setDouble] = useState('');
  const [triple, setTriple] = useState('');
  const [quad, setQuad] = useState('');
  const [five, setFive] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        deity,
        updatedAt: serverTimestamp(),
        category: {
          solo,
          singleBackup,
          double: double.split(',').map(s => s.trim()).filter(Boolean),
          triple: triple.split(',').map(s => s.trim()).filter(Boolean),
          quad: quad.split(',').map(s => s.trim()).filter(Boolean),
          five: five.split(',').map(s => s.trim()).filter(Boolean),
        },
      };

      await setDoc(doc(db, 'luckynumbers', deity), payload);

      toast.success('บันทึกเลขเด็ดเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">🧙‍♀️ บันทึกเลขเด็ดของเทพ</h1>

      <label className="block mb-2">เลือกเทพ</label>
      <select
        value={deity}
        onChange={e => setDeity(e.target.value)}
        className="mb-4 w-full border rounded p-2"
      >
        {deityOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Input placeholder="เลขเดี่ยว (1 ตัว)" value={solo} onChange={e => setSolo(e.target.value)} className="mb-2" />
      <Input placeholder="เลขเดี่ยวสำรอง" value={singleBackup} onChange={e => setSingleBackup(e.target.value)} className="mb-2" />
      <Textarea placeholder="เลข 2 ตัว (คั่นด้วย ,)" value={double} onChange={e => setDouble(e.target.value)} className="mb-2" />
      <Textarea placeholder="เลข 3 ตัว (คั่นด้วย ,)" value={triple} onChange={e => setTriple(e.target.value)} className="mb-2" />
      <Textarea placeholder="เลข 4 ตัว (คั่นด้วย ,)" value={quad} onChange={e => setQuad(e.target.value)} className="mb-2" />
      <Textarea placeholder="เลข 5 ตัว (คั่นด้วย ,)" value={five} onChange={e => setFive(e.target.value)} className="mb-4" />

      <Button disabled={loading} onClick={handleSubmit}>
        {loading ? 'กำลังบันทึก...' : '✅ บันทึกเลขเด็ด'}
      </Button>
    </div>
  );
}
