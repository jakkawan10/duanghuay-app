'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminPredictionPage() {
  const { god } = useParams() as { god: string }
  const [luckyNumber, setLuckyNumber] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!god) return
    const fetchCurrent = async () => {
      const ref = doc(db, 'predictions', god)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setLuckyNumber(snap.data().luckyNumber || '')
      }
    }
    fetchCurrent()
  }, [god])

  const handleSave = async () => {
    if (!god) return
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', god)
      await setDoc(ref, {
        luckyNumber,
        updatedAt: serverTimestamp(),
      })
      alert(`บันทึกเลขใหม่ให้ "${god}" เรียบร้อยแล้ว`)
    } catch (e) {
      console.error(e)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">
        🔮 กรอกเลขทำนาย ({god})
      </h1>
      <Input
        value={luckyNumber}
        onChange={(e) => setLuckyNumber(e.target.value)}
        placeholder="เช่น 123456"
      />
      <Button className="mt-4 w-full" onClick={handleSave} disabled={loading}>
        {loading ? 'กำลังบันทึก...' : 'บันทึกเลขใหม่'}
      </Button>
    </div>
  )
}
