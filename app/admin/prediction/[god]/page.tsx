'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [dateKey, setDateKey] = useState('') // YYYY-MM-DD
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    oneDigit: '',
    onePair: '',
    twoDigit: ['', ''],
    threeDigit: ['', '', ''],
    fourDigit: ['', '', '', ''],
    fiveDigit: ['', '', '', '', ''],
  })

  const handleChange = (field: string, value: any, index?: number) => {
    if (index !== undefined) {
      setForm((prev) => ({
        ...prev,
        [field]: prev[field as keyof typeof form].map((v: string, i: number) =>
          i === index ? value : v
        ),
      }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    if (!god) return alert('❌ ไม่มีค่า god')
    if (!dateKey) return alert('❌ กรุณากรอกวันที่ (YYYY-MM-DD)')

    setLoading(true)
    try {
      const ref = doc(db, 'predictions', god, 'dates', dateKey)
      await setDoc(ref, {
        ...form,
        updatedAt: serverTimestamp(),
      })
      alert(`✅ บันทึกเลขของ ${god} วันที่ ${dateKey} แล้ว`)
    } catch (e) {
      console.error(e)
      alert('❌ เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Admin: {god}</h1>

      <label className="block mb-2 font-medium">วันที่ (YYYY-MM-DD)</label>
      <Input
        value={dateKey}
        onChange={(e) => setDateKey(e.target.value)}
        placeholder="2025-09-25"
        className="mb-4"
      />

      {/* oneDigit */}
      <label className="block mb-2 font-medium">1 ตัวตรงตัวเดียว</label>
      <Input
        value={form.oneDigit}
        onChange={(e) => handleChange('oneDigit', e.target.value)}
        className="mb-4"
      />

      {/* onePair */}
      <label className="block mb-2 font-medium">1 ตัวเด่นรอบ</label>
      <Input
        value={form.onePair}
        onChange={(e) => handleChange('onePair', e.target.value)}
        className="mb-4"
      />

      {/* twoDigit */}
      <label className="block mb-2 font-medium">2 ตัวเป้า</label>
      <div className="flex gap-2 mb-4">
        {form.twoDigit.map((val, i) => (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange('twoDigit', e.target.value, i)}
          />
        ))}
      </div>

      {/* threeDigit */}
      <label className="block mb-2 font-medium">3 ตัวแม่</label>
      <div className="flex gap-2 mb-4">
        {form.threeDigit.map((val, i) => (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange('threeDigit', e.target.value, i)}
          />
        ))}
      </div>

      {/* fourDigit */}
      <label className="block mb-2 font-medium">4 ตัวมหารวย</label>
      <div className="flex gap-2 mb-4">
        {form.fourDigit.map((val, i) => (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange('fourDigit', e.target.value, i)}
          />
        ))}
      </div>

      {/* fiveDigit */}
      <label className="block mb-2 font-medium">5 ตัวราชา</label>
      <div className="flex gap-2 mb-4">
        {form.fiveDigit.map((val, i) => (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange('fiveDigit', e.target.value, i)}
          />
        ))}
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? '💾 กำลังบันทึก...' : '✅ Save'}
      </Button>
    </div>
  )
}
