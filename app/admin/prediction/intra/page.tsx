'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminIntraPredictionPage() {
  const [prediction, setPrediction] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPrediction = async () => {
      const ref = doc(db, 'predictions', 'intra')
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setPrediction(snap.data().text || '')
      }
    }
    fetchPrediction()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const ref = doc(db, 'predictions', 'intra')
      await setDoc(ref, {
        text: prediction,
        updatedAt: serverTimestamp(),
      })
      alert('✅ บันทึกคำทำนายของเจ้าองค์อินทร์แสนดี เรียบร้อยแล้ว')
    } catch (e) {
      console.error(e)
      alert('❌ เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">🧙‍♂️ คำทำนายของเจ้าองค์อินทร์แสนดี (Admin)</h1>
      <Input
        value={prediction}
        onChange={(e) => setPrediction(e.target.value)}
        placeholder="กรอกคำทำนาย เช่น ‘วันนี้โชคดีระวังเรื่องอารมณ์’"
      />
      <Button className="mt-4 w-full" onClick={handleSave} disabled={loading}>
        {loading ? 'กำลังบันทึก...' : 'บันทึกคำทำนาย' }
      </Button>
    </div>
  )
}
