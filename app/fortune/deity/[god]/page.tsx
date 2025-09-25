'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'

type PredictionData = {
  oneDigit: string
  onePair: string
  twoDigit: string
  threeDigit: string
  fourDigit: string
  fiveDigit: string
}

const deityImages: Record<string, string> = {
  sroiboon: '/images/sroiboon.png',
  maneewitch: '/images/maneewitch.png',
  intra: '/images/intra.png',
  dandok: '/images/dandok.png',
}

export default function DeityPage() {
  const { god } = useParams() as { god: string }
  const [data, setData] = useState<PredictionData | null>(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!god) return
    const fetchLatest = async () => {
      try {
        const q = query(
          collection(db, 'predictions', god, 'dates'),
          orderBy('__name__', 'desc'), // ใช้ชื่อ doc (วันที่) เป็นตัว sort
          limit(1)
        )
        const snap = await getDocs(q)
        if (!snap.empty) {
          const docSnap = snap.docs[0]
          setDate(docSnap.id)
          setData(docSnap.data() as PredictionData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchLatest()
  }, [god])

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>
  if (!data) return <p className="text-center text-red-500 mt-10">❌ ไม่พบข้อมูล</p>

  // helper render
  const renderBoxes = (label: string, value: string) => (
    <div className="mb-4">
      <p className="font-semibold">{label}</p>
      <div className="flex gap-2 mt-2">
        {value.split('').map((digit, i) => (
          <div
            key={i}
            className="w-10 h-10 flex items-center justify-center border rounded bg-gray-100 text-lg font-bold"
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">📅 {date}</h1>
      {deityImages[god] && (
        <img
          src={deityImages[god]}
          alt={god}
          className="w-full h-auto rounded mb-6"
        />
      )}

      {renderBoxes('วิ่งโดดตัวเดียว', data.oneDigit)}
      {renderBoxes('ยิงเดี่ยวรอง', data.onePair)}
      {renderBoxes('2 ตัวเป้า', data.twoDigit)}
      {renderBoxes('3 ตัว', data.threeDigit)}
      {renderBoxes('4 ตัว', data.fourDigit)}
      {renderBoxes('5 ตัวรวยไว', data.fiveDigit)}
    </div>
  )
}
