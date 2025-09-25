'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const defaultData = {
  oneDigit: '',
  onePair: '',
  twoDigit: ['', ''],
  threeDigit: ['', '', ''],
  fourDigit: ['', '', '', ''],
  fiveDigit: ['', '', '', '', '']
}

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [form, setForm] = useState(defaultData)
  const [loading, setLoading] = useState(false)

  // โหลดข้อมูลเก่า (ถ้ามี)
  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, 'predictions', god)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setForm({ ...defaultData, ...snap.data() })
      }
    }
    if (god) fetchData()
  }, [god])

  const handleChange = (field: string, index: number | null, value: string) => {
    setForm((prev) => {
      if (index === null) {
        return { ...prev, [field]: value }
      }
      return {
        ...prev,
        [field]: prev[field as keyof typeof defaultData].map((v: string, i: number) =>
          i === index ? value : v
        )
      }
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', god)
      await setDoc(ref, {
        ...form,
        updatedAt: serverTimestamp()
      })
      alert('✅ บันทึกเลขสำเร็จ')
    } catch (err) {
      console.error(err)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">แก้ไขเลขของ {god}</h1>

      <label>วิ่งโดดตัวเดียว</label>
      <Input value={form.oneDigit} onChange={e => handleChange('oneDigit', null, e.target.value)} className="mb-2" />

      <label>ยิงเดี่ยวรอง</label>
      <Input value={form.onePair} onChange={e => handleChange('onePair', null, e.target.value)} className="mb-2" />

      <label>2 ตัวเป้า</label>
      {form.twoDigit.map((val, i) => (
        <Input key={i} value={val} onChange={e => handleChange('twoDigit', i, e.target.value)} className="mb-2" />
      ))}

      <label>3 ตัวแม่สร้อยบุญ</label>
      {form.threeDigit.map((val, i) => (
        <Input key={i} value={val} onChange={e => handleChange('threeDigit', i, e.target.value)} className="mb-2" />
      ))}

      <label>4 ตัวมหารวย</label>
      {form.fourDigit.map((val, i) => (
        <Input key={i} value={val} onChange={e => handleChange('fourDigit', i, e.target.value)} className="mb-2" />
      ))}

      <label>5 ตัวรวยไว</label>
      {form.fiveDigit.map((val, i) => (
        <Input key={i} value={val} onChange={e => handleChange('fiveDigit', i, e.target.value)} className="mb-2" />
      ))}

      <Button disabled={loading} onClick={handleSave}>
        {loading ? 'กำลังบันทึก...' : '✅ บันทึก'}
      </Button>
    </div>
  )
}
