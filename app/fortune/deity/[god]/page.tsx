'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Prediction = {
  single: string
  backup: string
  double: string[]
  triple: string[]
  quad: string[]
  five: string[]
}

const deityImages: Record<string, string> = {
  sroiboon: '/images/sroiboon.png',
  maneewitch: '/images/maneewitch.png',
  intra: '/images/intra.png',
  dandok: '/images/dandok.png',
}

export default function DeityPage() {
  const { god } = useParams<{ god: string }>()
  const [data, setData] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, 'predictions', god)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setData(snap.data() as Prediction)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (god) fetchData()
  }, [god])

  if (loading) return <p className="text-center mt-10">⏳ กำลังโหลด...</p>
  if (!data) return <p className="text-center text-red-500 mt-10">❌ ไม่พบข้อมูล</p>

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center p-6">
      <img
        src={deityImages[god] || '/images/default.png'}
        alt={god}
        className="w-80 h-auto mb-6 rounded-xl shadow-lg"
      />

      <h1 className="text-2xl font-bold mb-6">✨ เลขเด็ดงวดนี้ ✨</h1>

      <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg space-y-4">
        <p>วิ่งโดดตัวเดียว: <span className="font-bold">{data.single}</span></p>
        <p>ยิงเดี่ยวรอง: <span className="font-bold">{data.backup}</span></p>
        <p>เลข 2 ตัว: {data.double.join(' , ')}</p>
        <p>เลข 3 ตัว: {data.triple.join(' , ')}</p>
        <p>เลข 4 ตัว: {data.quad.join(' , ')}</p>
        <p>เลข 5 ตัว: {data.five.join(' , ')}</p>
      </div>

      <button
        onClick={() => alert('👉 เข้าดูดวงได้ที่ เทพ AI เร็วๆ นี้')}
        className="mt-8 bg-gradient-to-r from-yellow-400 to-red-500 px-6 py-3 rounded-lg text-white font-bold shadow-lg hover:scale-105 transition"
      >
        🔮 เข้าดูดวงได้ที่ เทพ AI
      </button>
    </div>
  )
}
