'use client'

import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminPredictionPage({ params }: { params: { god: string } }) {
  const { god } = params
  const [oneDigit, setOneDigit] = useState('')
  const [onePair, setOnePair] = useState('')
  const [twoDigit, setTwoDigit] = useState(['', ''])
  const [threeDigit, setThreeDigit] = useState(['', '', ''])
  const [fourDigit, setFourDigit] = useState(['', '', '', ''])
  const [fiveDigit, setFiveDigit] = useState(['', '', '', '', ''])
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        oneDigit,
        onePair,
        twoDigit: twoDigit.filter(Boolean),
        threeDigit: threeDigit.filter(Boolean),
        fourDigit: fourDigit.filter(Boolean),
        fiveDigit: fiveDigit.filter(Boolean),
      }
      await setDoc(doc(db, 'predictions', god), payload)
      toast.success('บันทึกสำเร็จ')
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">แก้ไขตัวเลขของ {god}</h1>

      <Input placeholder="วิ่งโดดตัวเดียว" value={oneDigit} onChange={(e) => setOneDigit(e.target.value)} className="mb-2" />
      <Input placeholder="ยิงเดี่ยวรอง" value={onePair} onChange={(e) => setOnePair(e.target.value)} className="mb-2" />

      <div className="mb-2">
        <p>เลข 2 ตัว</p>
        {twoDigit.map((v, i) => (
          <Input key={i} value={v} onChange={(e) => {
            const arr = [...twoDigit]; arr[i] = e.target.value; setTwoDigit(arr)
          }} className="mb-1" />
        ))}
      </div>

      <div className="mb-2">
        <p>เลข 3 ตัว</p>
        {threeDigit.map((v, i) => (
          <Input key={i} value={v} onChange={(e) => {
            const arr = [...threeDigit]; arr[i] = e.target.value; setThreeDigit(arr)
          }} className="mb-1" />
        ))}
      </div>

      <div className="mb-2">
        <p>เลข 4 ตัว</p>
        {fourDigit.map((v, i) => (
          <Input key={i} value={v} onChange={(e) => {
            const arr = [...fourDigit]; arr[i] = e.target.value; setFourDigit(arr)
          }} className="mb-1" />
        ))}
      </div>

      <div className="mb-2">
        <p>เลข 5 ตัว</p>
        {fiveDigit.map((v, i) => (
          <Input key={i} value={v} onChange={(e) => {
            const arr = [...fiveDigit]; arr[i] = e.target.value; setFiveDigit(arr)
          }} className="mb-1" />
        ))}
      </div>

      <Button disabled={loading} onClick={handleSave}>
        {loading ? 'กำลังบันทึก...' : '✅ บันทึก'}
      </Button>
    </div>
  )
}
