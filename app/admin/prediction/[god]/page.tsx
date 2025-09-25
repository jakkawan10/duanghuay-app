'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const defaultForm = {
  oneDigit: '',
  onePair: '',
  twoDigit: ['', ''],
  threeDigit: ['', '', ''],
  fourDigit: ['', '', '', ''],
  fiveDigit: ['', '', '', '', ''],
}

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [dateKey, setDateKey] = useState('') // Admin กรอกวันที่เอง เช่น 2025-09-25
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  // โหลดข้อมูลเก่ามาแก้ไข
  const handleLoad = async () => {
    if (!dateKey) return alert('กรุณากรอกวันที่ก่อน')
    const ref = doc(db, 'predictions', god, 'dates', dateKey)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      setForm({
        ...defaultForm,
        ...snap.data(),
      })
    } else {
      alert('ยังไม่มีข้อมูลสำหรับวันนี้')
    }
  }

  // แก้ค่าช่อง input
  const handleChange = (
    field: keyof typeof defaultForm,
    value: string,
    index?: number
  ) => {
    setForm((prev) => {
      if (Array.isArray(prev[field])) {
        const arr = [...(prev[field] as string[])]
        if (index !== undefined) arr[index] = value
        return { ...prev, [field]: arr }
      }
      return { ...prev, [field]: value }
    })
  }

  // Save ไป Firestore
  const handleSave = async () => {
    if (!dateKey) return alert('กรุณากรอกวันที่ก่อน')
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', god, 'dates', dateKey)
      await setDoc(ref, form, { merge: true })
      alert('✅ บันทึกเรียบร้อย')
    } catch (e) {
      console.error(e)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Admin พิมพ์เลข ({god})</h1>

      {/* วันที่ */}
      <label className="block mb-2">วันที่ (เช่น 2025-09-25)</label>
      <Input
        value={dateKey}
        onChange={(e) => setDateKey(e.target.value)}
        placeholder="กรอกวันที่"
        className="mb-4"
      />
      <Button onClick={handleLoad} className="mb-6">
        โหลดข้อมูลเดิม
      </Button>

      {/* oneDigit */}
      <label>1 ตัวตรงตัวเดียว</label>
      <Input
        value={form.oneDigit}
        onChange={(e) => handleChange('oneDigit', e.target.value)}
        className="mb-2"
      />

      {/* onePair */}
      <label>1 ตัวเด่นรอบ</label>
      <Input
        value={form.onePair}
        onChange={(e) => handleChange('onePair', e.target.value)}
        className="mb-2"
      />

      {/* twoDigit */}
      <label>2 ตัวเป้า</label>
      {form.twoDigit.map((v, i) => (
        <Input
          key={i}
          value={v}
          onChange={(e) => handleChange('twoDigit', e.target.value, i)}
          className="mb-2"
        />
      ))}

      {/* threeDigit */}
      <label>3 ตัวแม่</label>
      {form.threeDigit.map((v, i) => (
        <Input
          key={i}
          value={v}
          onChange={(e) => handleChange('threeDigit', e.target.value, i)}
          className="mb-2"
        />
      ))}

      {/* fourDigit */}
      <label>4 ตัวมหารวย</label>
      {form.fourDigit.map((v, i) => (
        <Input
          key={i}
          value={v}
          onChange={(e) => handleChange('fourDigit', e.target.value, i)}
          className="mb-2"
        />
      ))}

      {/* fiveDigit */}
      <label>5 ตัวราชา</label>
      {form.fiveDigit.map((v, i) => (
        <Input
          key={i}
          value={v}
          onChange={(e) => handleChange('fiveDigit', e.target.value, i)}
          className="mb-2"
        />
      ))}

      <Button onClick={handleSave} disabled={loading} className="mt-4 w-full">
        {loading ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
      </Button>
    </div>
  )
}
