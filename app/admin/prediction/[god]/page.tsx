'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// โครงสร้าง B: เก็บเลขเป็น array
const defaultData = {
  solo: '',
  singleBackup: '',
  double: ['', ''],
  triple: ['', '', ''],
  quad: ['', '', '', ''],
  five: ['', '', '', '', ''],
}

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [formData, setFormData] = useState(defaultData)
  const [loading, setLoading] = useState(false)

  // ฟังก์ชันแก้ไขค่าใน array
  const handleArrayChange = (field: keyof typeof defaultData, index: number, value: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : []
      return {
        ...prev,
        [field]: current.map((v: string, i: number) => (i === index ? value : v)),
      }
    })
  }

  // ฟังก์ชันแก้ไขค่าที่เป็น string ปกติ
  const handleChange = (field: keyof typeof defaultData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'predictions', god), payload)
      toast.success('บันทึกเลขเด็ดเรียบร้อยแล้ว')
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">🧙‍♀️ Admin – บันทึกเลขเด็ด {god}</h1>

      {/* 1 ตัว */}
      <Input
        placeholder="เลขเดี่ยว (1 ตัว)"
        value={formData.solo}
        onChange={(e) => handleChange('solo', e.target.value)}
        className="mb-2"
      />

      {/* เลขเดี่ยวสำรอง */}
      <Input
        placeholder="เลขเดี่ยวสำรอง"
        value={formData.singleBackup}
        onChange={(e) => handleChange('singleBackup', e.target.value)}
        className="mb-4"
      />

      {/* 2 ตัว */}
      <h2 className="font-semibold mb-1">เลข 2 ตัว</h2>
      {formData.double.map((v, i) => (
        <Input
          key={i}
          placeholder={`คู่ที่ ${i + 1}`}
          value={v}
          onChange={(e) => handleArrayChange('double', i, e.target.value)}
          className="mb-2"
        />
      ))}

      {/* 3 ตัว */}
      <h2 className="font-semibold mb-1">เลข 3 ตัว</h2>
      {formData.triple.map((v, i) => (
        <Input
          key={i}
          placeholder={`สามตัวที่ ${i + 1}`}
          value={v}
          onChange={(e) => handleArrayChange('triple', i, e.target.value)}
          className="mb-2"
        />
      ))}

      {/* 4 ตัว */}
      <h2 className="font-semibold mb-1">เลข 4 ตัว</h2>
      {formData.quad.map((v, i) => (
        <Input
          key={i}
          placeholder={`สี่ตัวที่ ${i + 1}`}
          value={v}
          onChange={(e) => handleArrayChange('quad', i, e.target.value)}
          className="mb-2"
        />
      ))}

      {/* 5 ตัว */}
      <h2 className="font-semibold mb-1">เลข 5 ตัว</h2>
      {formData.five.map((v, i) => (
        <Input
          key={i}
          placeholder={`ห้าตัวที่ ${i + 1}`}
          value={v}
          onChange={(e) => handleArrayChange('five', i, e.target.value)}
          className="mb-2"
        />
      ))}

      <Button disabled={loading} onClick={handleSubmit} className="mt-4">
        {loading ? 'กำลังบันทึก...' : '✅ บันทึกเลขเด็ด'}
      </Button>
    </div>
  )
}
