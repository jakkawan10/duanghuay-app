'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminPredictionPage({ params }: { params: { god: string } }) {
  const deity = params.god;
  const [solo, setSolo] = useState('');
  const [singleBackup, setSingleBackup] = useState('');
  const [double, setDouble] = useState(['', '']);
  const [triple, setTriple] = useState(['', '', '']);
  const [quad, setQuad] = useState(['', '', '', '']);
  const [five, setFive] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'predictions', deity));
      if (snap.exists()) {
        const data = snap.data();
        setSolo(data.category?.solo || '');
        setSingleBackup(data.category?.singleBackup || '');
        setDouble(data.category?.double || ['', '']);
        setTriple(data.category?.triple || ['', '', '']);
        setQuad(data.category?.quad || ['', '', '', '']);
        setFive(data.category?.five || ['', '', '', '', '']);
      }
    };
    fetchData();
  }, [deity]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        deity,
        updatedAt: serverTimestamp(),
        category: {
          solo,
          singleBackup,
          double,
          triple,
          quad,
          five,
        },
      };

      await setDoc(doc(db, 'predictions', deity), payload);
      toast.success('บันทึกเลขสำเร็จ');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">แก้ไขตัวเลขของ {deity}</h1>

      <label>วิ่งโดดตัวเดียว</label>
      <Input value={solo} onChange={e => setSolo(e.target.value)} className="mb-2" />

      <label>ยิงเดี่ยวรอง</label>
      <Input value={singleBackup} onChange={e => setSingleBackup(e.target.value)} className="mb-2" />

      <label>เลข 2 ตัว</label>
      <div className="flex gap-2 mb-2">
        {double.map((v, i) => (
          <Input key={i} value={v} onChange={e => {
            const copy = [...double];
            copy[i] = e.target.value;
            setDouble(copy);
          }} />
        ))}
      </div>

      <label>เลข 3 ตัว</label>
      <div className="flex gap-2 mb-2">
        {triple.map((v, i) => (
          <Input key={i} value={v} onChange={e => {
            const copy = [...triple];
            copy[i] = e.target.value;
            setTriple(copy);
          }} />
        ))}
      </div>

      <label>เลข 4 ตัว</label>
      <div className="flex gap-2 mb-2">
        {quad.map((v, i) => (
          <Input key={i} value={v} onChange={e => {
            const copy = [...quad];
            copy[i] = e.target.value;
            setQuad(copy);
          }} />
        ))}
      </div>

      <label>เลข 5 ตัว</label>
      <div className="flex gap-2 mb-4">
        {five.map((v, i) => (
          <Input key={i} value={v} onChange={e => {
            const copy = [...five];
            copy[i] = e.target.value;
            setFive(copy);
          }} />
        ))}
      </div>

      <Button disabled={loading} onClick={handleSubmit}>
        {loading ? 'กำลังบันทึก...' : '✅ บันทึก'}
      </Button>
    </div>
  );
}
