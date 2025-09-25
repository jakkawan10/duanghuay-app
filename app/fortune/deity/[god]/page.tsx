'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Prediction = {
  solo: string
  singleBackup: string
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

export default function DeityPage({ params }: { params: { god: string } }) {
  const { god } = params
  const [data, setData] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'predictions', god))
        if (snap.exists()) {
          setData(snap.data() as Prediction)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [god])

  if (loading) return <p className="text-center p-4">⏳ กำลังโหลด...</p>
  if (!data) return <p className="text-center p-4 text-red-500">❌ ไม่พบข้อมูล</p>

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-center mb-4">คำทำนายจาก {god}</h1>

      {/* รูปเทพ */}
      <div className="flex justify-center">
        <img src={deityImages[god]} alt={god} className="rounded-xl shadow w-64" />
      </div>

      <div className="space-y-3">
        <p>วิ่งโดดตัวเดียว: <span className="font-bold">{data.solo}</span></p>
        <p>ยิงเดี่ยวรอง: <span className="font-bold">{data.singleBackup}</span></p>

        <p>2 ตัวเป้า:</p>
        <div className="flex gap-2">
          {data.double.map((n, i) => <div key={i} className="p-2 border rounded">{n}</div>)}
        </div>

        <p>3 ตัว:</p>
        <div className="flex gap-2">
          {data.triple.map((n, i) => <div key={i} className="p-2 border rounded">{n}</div>)}
        </div>

        <p>4 ตัว:</p>
        <div className="flex gap-2">
          {data.quad.map((n, i) => <div key={i} className="p-2 border rounded">{n}</div>)}
        </div>

        <p>5 ตัว:</p>
        <div className="flex gap-2">
          {data.five.map((n, i) => <div key={i} className="p-2 border rounded">{n}</div>)}
        </div>
      </div>
    </div>
  )
}
