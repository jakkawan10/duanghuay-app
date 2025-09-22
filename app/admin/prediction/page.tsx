'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminPredictionPage() {
  const [luckyNumber, setLuckyNumber] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCurrent = async () => {
      const ref = doc(db, 'predictions', 'latest')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setLuckyNumber(snap.data().luckyNumber)
      }
    }
    fetchCurrent()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', 'latest')
      await setDoc(ref, {
        luckyNumber,
        updatedAt: serverTimestamp(),
      })
      alert('บันทึกเลขใหม่เรียบร้อยแล้ว')
    } catch (e) {
      console.error(e)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">🔮 กรอกเลขทำนาย (Admin)</h1>
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
