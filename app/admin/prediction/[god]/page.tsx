'use client'

import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type NumbersArray = string[]

const defaultData = {
  solo: '',
  singleBackup: '',
  double: ['', ''],
  triple: ['', '', ''],
  quad: ['', '', '', ''],
  five: ['', '', '', '', ''],
}

export default function AdminPage({ params }: { params: { god: string } }) {
  const { god } = params
  const [form, setForm] = useState(defaultData)
  const [loading, setLoading] = useState(false)

  const handleChangeArray = (field: keyof typeof form, index: number, value: string) => {
    const arr = [...(form[field] as NumbersArray)]
    arr[index] = value
    setForm((prev) => ({ ...prev, [field]: arr }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        updatedAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'predictions', god), payload)
      toast.success(`บันทึกเลขของ ${god} สำเร็จแล้ว`)
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">🧙‍♂️ แก้ไขตัวเลขของ {god}</h1>

      <Input
        placeholder="วิ่งโดดตัวเดียว"
        value={form.solo}
        onChange={(e) => setForm({ ...form, solo: e.target.value })}
      />
      <Input
        placeholder="ยิงเดี่ยวรอง"
        value={form.singleBackup}
        onChange={(e) => setForm({ ...form, singleBackup: e.target.value })}
      />

      {/* Double */}
      <label>เลข 2 ตัว</label>
      <div className="grid grid-cols-2 gap-2">
        {form.double.map((val, i) => (
          <Input key={i} value={val} onChange={(e) => handleChangeArray('double', i, e.target.value)} />
        ))}
      </div>

      {/* Triple */}
      <label>เลข 3 ตัว</label>
      <div className="grid grid-cols-3 gap-2">
        {form.triple.map((val, i) => (
          <Input key={i} value={val} onChange={(e) => handleChangeArray('triple', i, e.target.value)} />
        ))}
      </div>

      {/* Quad */}
      <label>เลข 4 ตัว</label>
      <div className="grid grid-cols-4 gap-2">
        {form.quad.map((val, i) => (
          <Input key={i} value={val} onChange={(e) => handleChangeArray('quad', i, e.target.value)} />
        ))}
      </div>

      {/* Five */}
      <label>เลข 5 ตัว</label>
      <div className="grid grid-cols-5 gap-2">
        {form.five.map((val, i) => (
          <Input key={i} value={val} onChange={(e) => handleChangeArray('five', i, e.target.value)} />
        ))}
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full">
        {loading ? 'กำลังบันทึก...' : '✅ บันทึกเลข'}
      </Button>
    </div>
  )
}
