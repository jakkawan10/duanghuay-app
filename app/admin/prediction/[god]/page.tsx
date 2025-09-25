'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }

  // state
  const [date, setDate] = useState('')
  const [numbers, setNumbers] = useState({
    oneDigit: '',
    onePair: '',
    twoDigit: ['', ''],
    threeDigit: ['', '', ''],
    fourDigit: ['', '', '', ''],
    fiveDigit: ['', '', '', '', ''],
  })
  const [loading, setLoading] = useState(false)

  // โหลดข้อมูล (ถ้ามี)
  useEffect(() => {
    if (!god || !date) return

    const fetchData = async () => {
      const ref = doc(db, 'predictions', god, 'dates', date)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setNumbers({
          oneDigit: snap.data().oneDigit || '',
          onePair: snap.data().onePair || '',
          twoDigit: (snap.data().twoDigit || '').split(''),
          threeDigit: (snap.data().threeDigit || '').split(''),
          fourDigit: (snap.data().fourDigit || '').split(''),
          fiveDigit: (snap.data().fiveDigit || '').split(''),
        })
      }
    }
    fetchData()
  }, [god, date])

  // ฟังก์ชันเซฟ
  const handleSave = async () => {
    if (!god || !date) {
      alert('กรุณากรอกวันที่ก่อน')
      return
    }
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', god, 'dates', date)
      await setDoc(ref, {
        oneDigit: numbers.oneDigit,
        onePair: numbers.onePair,
        twoDigit: numbers.twoDigit.join(''),
        threeDigit: numbers.threeDigit.join(''),
        fourDigit: numbers.fourDigit.join(''),
        fiveDigit: numbers.fiveDigit.join(''),
        updatedAt: new Date().toISOString(),
      })
      alert(`บันทึกข้อมูลของ ${god} วันที่ ${date} สำเร็จแล้ว`)
    } catch (e) {
      console.error(e)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  // helper สำหรับ render ช่อง input
  const renderInputs = (label: string, key: keyof typeof numbers, count: number) => (
    <div className="mb-4">
      <label className="font-semibold">{label}</label>
      <div className="flex gap-2 mt-2">
        {Array.from({ length: count }).map((_, i) => (
          <Input
            key={i}
            className="w-12 text-center"
            value={(numbers[key] as string[])[i] || ''}
            maxLength={1}
            onChange={(e) => {
              const val = e.target.value
              setNumbers((prev) => {
                const updated = { ...prev }
                const arr = [...(updated[key] as string[])]
                arr[i] = val
                updated[key] = arr as any
                return updated
              })
            }}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Admin: {god}</h1>

      {/* กรอกวันที่ */}
      <div className="mb-4">
        <label className="font-semibold">วันที่ (YYYY-MM-DD)</label>
        <Input
          type="text"
          placeholder="2025-09-25"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* ฟิลด์ตัวเลข */}
      {renderInputs('วิ่งโดดตัวเดียว', 'oneDigit', 1)}
      {renderInputs('ยิงเดี่ยวรอง', 'onePair', 1)}
      {renderInputs('2 ตัวเป้า', 'twoDigit', 2)}
      {renderInputs('3 ตัวแม่สร้อยบุญ', 'threeDigit', 3)}
      {renderInputs('4 ตัวขนทรัพย์', 'fourDigit', 4)}
      {renderInputs('5 ตัวรวยไว', 'fiveDigit', 5)}

      <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
      </Button>
    </div>
  )
}
